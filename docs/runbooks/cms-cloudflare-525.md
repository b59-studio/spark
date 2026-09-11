# Runbook: Fix Cloudflare 525 on the CMS (`cms.texasspark.org`)

**Symptom:** Visiting `https://cms.texasspark.org` returns a Cloudflare
**Error 525 — "SSL handshake failed"** between Cloudflare and the origin.

**Origin droplet:** `167.99.224.49` (DigitalOcean, WordPress on **Caddy v2 +
php-fpm 8.3**, not nginx — the cert/reload steps below use Caddy).

## Diagnosis (confirmed)

`cms.texasspark.org` is proxied through Cloudflare (orange-cloud). Cloudflare
reaches the origin over HTTPS (SSL/TLS mode Full or Full (Strict)).

- Connecting to the origin **without SNI / by raw IP** → handshake completes,
  origin presents a valid Let's Encrypt cert (TLS 1.3). The default vhost is fine.
- Connecting **with SNI `cms.texasspark.org`** → origin returns a TLS
  `internal_error` alert (alert 80) and **no certificate** → handshake fails →
  Cloudflare surfaces **525**.

Reproduce the failure (from any machine):

```bash
# Fails today with: tlsv1 alert internal error
curl -I --resolve cms.texasspark.org:443:167.99.224.49 https://cms.texasspark.org/

# Works today (proves origin TLS itself is healthy on the default vhost):
echo | openssl s_client -connect 167.99.224.49:443 2>&1 | grep -i issuer
```

**Root cause:** The site originally had a Let's Encrypt cert for
`cms.texasspark.org`. After the domain was placed behind the Cloudflare proxy,
Let's Encrypt's HTTP-01 renewal challenge is intercepted by Cloudflare and
fails. The cert expired / was removed, leaving the nginx vhost bound to a dead
certificate, so every Cloudflare origin pull fails the TLS handshake.

## Fix (durable): Cloudflare Origin Certificate + Full (Strict)

This avoids the HTTP-01 renewal trap (Origin Certs are valid 15 years and need
no ACME challenge).

1. **Cloudflare dashboard → SSL/TLS → Origin Server → Create Certificate.**
   - Hostnames: `cms.texasspark.org` and `*.texasspark.org`.
   - Copy the **Origin Certificate** and **Private Key**.

2. **On the droplet**, install them:

   ```bash
   sudo mkdir -p /etc/ssl/cloudflare
   sudo nano /etc/ssl/cloudflare/texasspark.pem   # paste Origin Certificate
   sudo nano /etc/ssl/cloudflare/texasspark.key   # paste Private Key
   sudo chmod 600 /etc/ssl/cloudflare/texasspark.key
   ```

3. **Point the `cms.texasspark.org` Caddy site block at the new cert** in
   `/etc/caddy/Caddyfile` (Caddy serves WordPress directly via `php_fastcgi` — see
   [`../../infra/hosting/digitalocean/Caddyfile.example`](../../infra/hosting/digitalocean/Caddyfile.example)):

   ```caddy
   cms.texasspark.org {
       tls /etc/ssl/cloudflare/texasspark.pem /etc/ssl/cloudflare/texasspark.key

       root * /var/www/html
       php_fastcgi unix//run/php/php8.3-fpm.sock
       file_server
   }
   ```

   Caddy auto-redirects HTTP→HTTPS, so no separate `:80` block is needed.

4. Validate and reload:

   ```bash
   caddy validate --config /etc/caddy/Caddyfile && sudo systemctl reload caddy
   ```

5. **Cloudflare → SSL/TLS → Overview → set Full (Strict).**

6. Verify the origin pull now succeeds:

   ```bash
   curl -I --resolve cms.texasspark.org:443:167.99.224.49 https://cms.texasspark.org/
   # Expect HTTP/2 200 (or a redirect), not a TLS error.
   ```

   Then load `https://cms.texasspark.org` in a browser — the 525 should be gone.

## Do NOT use Cloudflare "Flexible" mode as a shortcut

The origin force-redirects HTTP→HTTPS (`http://167.99.224.49` → 301 → https).
Flexible mode connects CF→origin over plain HTTP, so the origin's redirect would
bounce the browser into an infinite loop (`ERR_TOO_MANY_REDIRECTS`). Fix the
certificate instead.

## While you're in: second blocker (REST API)

WordPress **pretty permalinks are currently disabled**, so `/wp-json/...` (what
the Next.js clients call) is intercepted and serves the homepage instead of JSON.

- WP Admin → **Settings → Permalinks → Post name → Save.**
- Verify: `curl -s 'https://cms.texasspark.org/wp-json/wp/v2/pages?per_page=1'`
  should return JSON, not HTML.

## After the fix — wire the app

Once both blockers clear, set on the Next.js host (currently Vercel):

```
WORDPRESS_API_URL=https://cms.texasspark.org
MAILPOET_API_BASE_URL=https://cms.texasspark.org   # after MailPoet installed
WOOCOMMERCE_API_URL=https://cms.texasspark.org      # after WooCommerce installed
```

See `wordpress/CLOUDWAYS-GO-LIVE.md` for the full plugin/key/webhook checklist
(the steps are host-agnostic; substitute the DigitalOcean droplet for Cloudways).

---

# Related: admin menu links break (`/wp-admin` without the trailing slash)

**Symptom:** In `wp-admin`, clicking a left-menu item (Users, Pages, Plugins…)
lands on a page that doesn't exist — it drops the `/wp-admin/` prefix and hits
`cms.texasspark.org/users.php`, which 404s or bounces to the marketing site.
Deep-linking with the full `/wp-admin/...` path works.

**Root cause:** The WP admin menu uses **relative** links (`users.php`,
`edit.php?post_type=page`). Entered at the slash-less `/wp-admin`, the document's
base URL is `/`, so those links resolve to the site root instead of under
`/wp-admin/`. Normally Apache/mod_dir 301-redirects `/wp-admin` → `/wp-admin/`
(the canonical directory slash), but **behind the Cloudflare proxy that origin
redirect never reaches the browser**, so the admin loads with the wrong base.

**Fix (live): Cloudflare Redirect Rule.** Dashboard → `texasspark.org` zone →
**Rules → Redirect Rules → Create rule**:

- **Name:** `wp-admin trailing slash`
- **When incoming requests match** → *Custom filter expression*:
  ```
  (http.host eq "cms.texasspark.org" and http.request.uri.path eq "/wp-admin")
  ```
- **Then... → URL redirect → Static:**
  - **URL:** `https://cms.texasspark.org/wp-admin/`
  - **Status code:** `301`
  - **Preserve query string:** **On**

The exact-path match (`eq "/wp-admin"`) never touches `/wp-admin/` or deep links
like `/wp-admin/users.php`, so there is no redirect loop. Verify:

```bash
curl -sS -o /dev/null -D - "https://cms.texasspark.org/wp-admin" | grep -iE "^(HTTP|location)"
# Expect: HTTP/2 301  +  location: https://cms.texasspark.org/wp-admin/
```

**Alternatives (same one-line redirect, different layer), if you ever move off
Cloudflare:**

- **Caddy origin** — add `redir /wp-admin /wp-admin/ 308` to the CMS site block in
  `/etc/caddy/Caddyfile` (the live server is Caddy). The nginx equivalent
  (`location = /wp-admin { return 301 /wp-admin/$is_args$args; }`) is in the legacy
  `infra/hosting/digitalocean/nginx-cms.conf.example`.
- **WordPress mu-plugin** — `wordpress/mu-plugins/admin-trailing-slash.php` does
  it at the WP layer; copy it to `wp-content/mu-plugins/` on the droplet.

---

# Related: Jetpack logs users out after the math CAPTCHA (real client IP)

**Symptom:** Logging into `wp-admin` shows a Jetpack "prove you're human" math
question every time, then — intermittently — bounces the user straight back to
the login screen with an error.

**Root cause:** Jetpack's brute-force **Protect** module keys on `REMOTE_ADDR`.
Behind Cloudflare the origin sees a *Cloudflare* edge IP (verified live:
`REMOTE_ADDR=172.70.x` while the real client is in `Cf-Connecting-Ip`), and that
IP rotates across the login handshake, so Jetpack challenges everyone and
invalidates the session when the IP it saw at challenge time no longer matches.

**Fix (both layers — deployed):**

1. **Caddy** (`/etc/caddy/Caddyfile`, global options) — `trusted_proxies` +
   `client_ip_headers Cf-Connecting-Ip` over the Cloudflare ranges. Fixes
   `X-Forwarded-For` and access logs server-wide. See `Caddyfile.example`.
   *Caddy's `php_fastcgi` still passes the peer as fastcgi `REMOTE_ADDR`, so this
   alone does not fix PHP — hence step 2.*
2. **WordPress mu-plugin** `wordpress/mu-plugins/cloudflare-real-ip.php` — rewrites
   `$_SERVER['REMOTE_ADDR']` from `Cf-Connecting-Ip`, but only when the request
   actually arrived from a Cloudflare range (spoof-safe). This is what Jetpack
   reads. Copy it to `wp-content/mu-plugins/` on the droplet.

Verify (through Cloudflare, temporary probe): a script echoing `REMOTE_ADDR`
should report the real visitor IP, not `172.x`/`162.x`/`104.x`.

**Hardening:** ufw on the droplet allows SSH + 80/443 **from Cloudflare ranges
only**, so no one can reach the origin directly and bypass the real-IP trust.

**Bonus:** `wordpress/mu-plugins/remember-login-duration.php` extends "Remember
Me" logins to 30 days so the team rarely revisits the login screen at all.
