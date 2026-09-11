# Runbook: Decommission `jfseamus.com`

The domain is being reclaimed by its owner. This is the ordered list of every
place it is still wired in, what has already been done, and what each remaining
step needs that a repo change cannot supply.

**Surveyed 2026-09-10.** Re-run the verification block at the bottom before
acting — DNS and Vercel state drift.

---

## The one thing that actually blocks the handover

`login.jfseamus.com` serves **200** and has no texasspark equivalent:

```
login.texasspark.org   dns=NONE          http=000
login.jfseamus.com     dns=172.67.199.230  http=200   <- live app, no replacement
```

Every other jfseamus host already redirects away:

| Host | Today |
| --- | --- |
| `jfseamus.com` | 307 → `https://www.texasspark.org/` |
| `cms.jfseamus.com` | 302 → `https://cms.texasspark.org/wp-admin/` |
| `login.jfseamus.com` | **200 — serves the spark-admin app** |

So the domain cannot be handed back until spark-admin answers on a texasspark
host. That is a **spark-admin** change (`~/code/spark-admin`), not a change in
this repo. Everything below is ordered around it.

---

## 1. Stand up the replacement login host — **blocking, spark-admin**

On Vercel the `jfseamus.com` domain has exactly one project attachment:

```
Project        Domains
spark-admin    admin.jfseamus.com
```

`login.jfseamus.com` is not in that list, so it reaches the app through a
Cloudflare DNS record rather than a Vercel domain — check the Cloudflare
`jfseamus.com` zone for what `login` points at before removing anything.

1. Add `login.texasspark.org` (and/or `admin.texasspark.org`) to the
   **spark-admin** Vercel project.
2. Create the matching record in the Cloudflare `texasspark.org` zone.
3. Check the app accepts the new host — session-cookie domain, any allowed-origin
   or redirect-URI allow-list, and the OAuth/callback URLs of any identity
   provider it uses. A new hostname is the classic way to silently break a
   cookie-scoped session.
4. Confirm sign-in works end to end on the new host **before** step 2 below.

## 2. Repoint `NEXT_PUBLIC_LOGIN_URL` — **spark project, after step 1**

The header's Log In link. Production still holds `https://login.jfseamus.com`.

```bash
vercel env rm NEXT_PUBLIC_LOGIN_URL production --yes
printf 'https://login.texasspark.org' | vercel env add NEXT_PUBLIC_LOGIN_URL production
```

Then redeploy — env changes do not apply to an existing deployment.

> **Do not run this before step 1.** The target host does not resolve today, so
> flipping it now replaces a working Log In link with a dead one. The code
> fallback in `Header.tsx` is already `login.texasspark.org`, but env wins, so
> the deployed link keeps working until this is changed.

## 3. Repoint `WOOCOMMERCE_API_URL` — **spark project**

Production held `https://cms.jfseamus.com`. `cms.texasspark.org` is live, and the
WooCommerce integration is dormant (never enabled in production), so this one is
safe to do at any time and needs no coordination with step 1.

```bash
vercel env rm WOOCOMMERCE_API_URL production --yes
printf 'https://cms.texasspark.org' | vercel env add WOOCOMMERCE_API_URL production
```

## 4. Remove the Vercel domain attachment — **after step 1**

Detach `admin.jfseamus.com` from the **spark-admin** project, then remove
`jfseamus.com` from the b59-studio Vercel account.

## 5. Remove the Cloudflare records and rules — **needs Cloudflare access**

In the `jfseamus.com` zone:

- the `login` record (step 1 must be done first);
- the `cms` record and the 302 to `cms.texasspark.org`;
- the apex 307 to `www.texasspark.org`;
- the `/wp-admin` redirect rule documented in
  [`cms-cloudflare-525.md`](./cms-cloudflare-525.md).

These are **removals, not redirects** — a redirect on a domain you no longer
control is a promise you cannot keep.

## 6. Remove the CMS origin's site block — **needs droplet SSH**

On `167.99.224.49`, `/etc/caddy/Caddyfile` still has a `cms.jfseamus.com` block.
Delete it, then:

```bash
caddy validate --config /etc/caddy/Caddyfile && systemctl reload caddy
```

The Cloudflare Origin Certificate covering `*.jfseamus.com` stops being issuable
once the zone leaves the account, so reissue the origin cert for
`cms.texasspark.org` / `*.texasspark.org` at the same time — see
[`cms-cloudflare-525.md`](./cms-cloudflare-525.md), whose cert paths already
assume the texasspark names.

## 7. Optional — the hub's repo list

`.claude/skills/dedup-check/` names a GitHub repo `jfseamus`. That is a repo
name, not the domain, and the directory is a projection synced from
the-department, so the edit belongs in the hub if it is wanted at all.

---

## Already done (in this repo)

Every tracked file is clear of `jfseamus.com`. The three fallbacks that would
otherwise have resolved to the old host:

| File | Fallback |
| --- | --- |
| `next.config.ts` | `WORDPRESS_ORIGIN` → `cms.texasspark.org` |
| `src/components/Header.tsx` | Log In link → `login.texasspark.org` |
| `.mcp.json` | `WP_API_URL` → `cms.texasspark.org` |

Plus `scripts/seed-wp-pages.mjs`, `docs/sitemap.md`, `headless-redirect.php`,
both `infra/hosting/digitalocean/` docs, all three `wordpress/` handoff docs, and
the CMS 525 runbook.

---

## Verification

Re-run before and after any step:

```bash
for h in login.texasspark.org cms.texasspark.org www.texasspark.org \
         login.jfseamus.com cms.jfseamus.com jfseamus.com; do
  printf '%-24s dns=%-16s http=%s\n' "$h" \
    "$(dig +short "$h" | tail -1)" \
    "$(curl -s -o /dev/null -w '%{http_code}' -m 12 "https://$h/")"
done
```

The handover is safe when every `*.jfseamus.com` row shows no DNS, and the
texasspark rows all answer.
