# TX*SPARK website — handoff & operations guide

This is the master handoff for the TX*SPARK website. It tells the team how to
run the site day-to-day, what's live versus what still needs switching on, and
gives a future developer the technical map. Pair it with
[CLIENT-ONBOARDING.md](./CLIENT-ONBOARDING.md) (the step-by-step content-editing
guide).

---

## 1. The big picture

The website is two pieces that work together:

1. **The public marketing site** — a Next.js app hosted on **Vercel**. This is
   what visitors see. The design and structure are code; the *words on the
   pages* come from WordPress.
2. **WordPress (the CMS)** — at **`https://cms.jfseamus.com`**, where your team
   logs in to edit content. Visitors never go here.

```
  You edit in WordPress  ──▶  the public marketing site updates (~1 min, no deploy)
```

You are responsible for **content** (editing pages, newsletter, products). A
developer is responsible for **code** (design, new features, the home page,
turning the commerce features on).

---

## 2. Editing content (day-to-day)

Full instructions are in **[CLIENT-ONBOARDING.md](./CLIENT-ONBOARDING.md)**. In short:

1. Log in at `https://cms.jfseamus.com/wp-admin/` (keep the trailing slash) or the shortcut `/(your site)/admin`, which adds it for you.
2. **Pages** → pick a page → edit → **Update**.
3. The public page updates within about a minute.

---

## 3. Features and their status

> **Vendor change (in progress).** The **newsletter is moving from MailPoet to
> Mailchimp**, and **donations are moving off Stripe** — the replacement donation
> tool is not yet chosen and **needs to be revisited once the team decides**. The
> MailPoet/Stripe rows below and the §4 setup steps describe the *current* code
> and will be updated once the switch lands.

| Feature | Status | What it needs to go live | Who runs it after |
| --- | --- | --- | --- |
| **Content pages** (About, Mission, Toolkits, etc.) | ✅ Live & editable | Nothing | Your team, in WordPress |
| **Newsletter** (MailPoet) | 🟡 Code ready | MailPoet plugin active + API key set | Your team manages the list in WordPress |
| **Donations** (Stripe) | 🟡 Code ready, dormant | Stripe account + keys + webhook | Mostly automatic; reports in Stripe |
| **Shop** (WooCommerce) | 🟡 Code ready, dormant | WooCommerce + Stripe gateway plugins + keys | Your team adds products in WordPress |

"Code ready, dormant" means the page exists and is built, but shows a graceful
"coming soon" state until the service is configured — nothing is broken in the
meantime.

---

## 4. Switching on each feature (for your developer)

All environment variables are documented in
[`env/site.integrations.example`](../env/site.integrations.example). Set them in
the site's host (Vercel) and redeploy.

### Newsletter (MailPoet)
1. In WordPress, install + activate **MailPoet**; enable its API
   (Settings → Advanced).
2. Set `MAILPOET_API_KEY` and `MAILPOET_API_BASE_URL=https://cms.jfseamus.com`.
3. Done — the signup boxes already post to it. Test one signup; it should appear
   in your MailPoet list (and in the Neon `analytics` DB if configured).

### Donations (Stripe)
1. Create a **Stripe** account; copy the **publishable** and **secret** keys
   (start with `test` keys).
2. Set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. The
   `/donate` page goes live as soon as both are set.
3. In Stripe → Developers → Webhooks, add an endpoint at
   `https://<site>/api/webhooks/stripe` subscribed to `payment_intent.succeeded`;
   copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
4. Run the analytics migration (`npm run analytics:migrate`) so donations are
   recorded.

### Shop (WooCommerce)
1. In WordPress, install + activate **WooCommerce** and the **WooCommerce Stripe
   Payment Gateway**; configure the gateway with the store's Stripe keys.
2. Create a read **REST API key** (WooCommerce → Settings → Advanced → REST API)
   and set `WOOCOMMERCE_API_URL`, `WOOCOMMERCE_CONSUMER_KEY`,
   `WOOCOMMERCE_CONSUMER_SECRET`.
3. Ensure the **Store API** is reachable and allows the site's origin (CORS).
4. Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` so the on-site card field renders.
5. Add published products in WooCommerce — they appear at `/shop`.
6. **Verify against the live store** before launch — the on-site checkout makes a
   few documented assumptions about the Store API/Stripe-gateway fields (see code
   comments in `src/lib/integrations/woocommerce/store-client.ts` and
   `src/app/api/shop/checkout/route.ts`).

---

## 5. Where everything lives (technical map)

| Thing | Where |
| --- | --- |
| Public site code | GitHub `b59-studio/spark`, deployed on **Vercel** (project `spark`) |
| WordPress CMS | DigitalOcean droplet `167.99.224.49`, served by **Caddy**, fronted by **Cloudflare**, at `cms.jfseamus.com` |
| Analytics database | **Neon** Postgres, `analytics` schema (newsletter / donation / order events) |
| Secrets / env vars | Vercel project env (optionally managed via Doppler) |
| TLS for the CMS | Cloudflare Origin Certificate in Caddy — see [runbook](../docs/runbooks/cms-cloudflare-525.md) |

---

## 6. Maintaining it

- **Content:** your team, entirely in WordPress.
- **WordPress + plugins:** keep WordPress core and plugins updated (security).
- **Rollback:** every change to the site code is in git history on GitHub —
  anything can be restored. The tag `pre-content-migration` marks the site before
  the content cleanup.
- **Code / features / design / home page:** your developer.

---

## 7. Known follow-ups

- **Toolkit lead-capture removed.** The old toolkit pages gated downloads behind
  an email signup; that's gone (resources are open). A signup box can be re-added
  later if you want to collect emails there.
- **Toolkit pages + Events are drafts** in WordPress — develop and publish them
  when ready. The Toolkits section currently shows the year-round overview.
- **Commerce needs live verification.** The donation and shop code is complete
  and builds, but the on-site WooCommerce checkout must be tested against a real
  store + Stripe gateway before launch (see §4 Shop, step 6).
- **Dependency advisories:** run `npm audit` and review before a production
  launch.
- **Content/language transition:** the move from the old GROW/PAL wording to the
  9-toolkit "year-round organizing" language is content work, done in WordPress.

---

## 8. Who to contact

- **Editing content, newsletter, products:** your team, in WordPress.
- **Everything else** — the home page, new pages/features, design changes, or
  switching on donations/shop — your developer.
