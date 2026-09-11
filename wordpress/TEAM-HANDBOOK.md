# TX*SPARK Website — Team Handbook

Everything the team needs to run the website day to day. Written for non-technical
editors; the developer-only bits are clearly marked **(dev)**. Where you see a
link, you can click straight through.

**The two key places:**
- 🌐 Public website: **<https://texasspark.org>** — what visitors see.
- 🔐 Content admin (WordPress): **<https://cms.texasspark.org/wp-admin/>** — where you log in to edit.

You edit in WordPress → the public site updates on its own (about a minute later).
No developer needed for everyday content.

---

## 1. Logging in

1. Go to **<https://cms.texasspark.org/wp-admin/>** (bookmark it — keep the trailing slash; without it the left-menu links break).
2. Sign in with your WordPress username and password.
3. Left menu → **Pages** to edit content, **Products** for the shop, **MailPoet** for the newsletter.

> The plain site at <https://cms.texasspark.org> is just the engine room — visitors
> are auto-redirected away from it. Ignore it; always work in **/wp-admin/**.

---

## 2. Editing pages

**To edit:** Pages → click a page → change the text → **Update** (top right). Wait
~1 minute, refresh the public page, and your change is live.

**Which WordPress page controls which web address:**

| Web page | WordPress page |
| --- | --- |
| [/about](https://texasspark.org/about) | About TX*SPARK |
| [/about/mission](https://texasspark.org/about/mission) | Mission |
| [/about/people](https://texasspark.org/about/people) | People |
| [/about/partners](https://texasspark.org/about/partners) | Partners |
| [/about/data](https://texasspark.org/about/data) | Data integrity |
| [/about/privacy](https://texasspark.org/about/privacy) | Privacy Policy |
| [/about/terms](https://texasspark.org/about/terms) | Terms of Use |
| [/work](https://texasspark.org/work) | Work |
| [/toolkits](https://texasspark.org/toolkits) | Toolkits |
| [/events](https://texasspark.org/events) | Events *(draft)* |
| Each toolkit | "Get To Know Your Precinct", etc. *(drafts)* |

**Adding a link:** select the text → click the **link icon** (🔗) in the toolbar →
paste the address. For a link *within* this site, use a short path like
`/about/data`. For an outside site, paste the full `https://…`. Tick "Open in new
tab" for external links.

**Adding content:** use the **+** button to add a paragraph, heading, list, quote,
or image block. Tip: when pasting from Word or Google Docs, use **paste as plain
text** (⌘⇧V / Ctrl-Shift-V) so it doesn't drag in messy formatting.

**Things to keep in mind:**
- **Published vs Draft** — only **Published** pages show on the site. Drafts stay
  hidden until you click **Publish**.
- **Changes take ~1 minute** to appear (the site caches for speed) — they're not
  instant. Don't panic if a refresh looks unchanged; wait a moment.
- **The page title becomes the big heading** on the page — keep it clean.
- **The home page is NOT editable here** — it's custom-built. Ask your developer
  for home-page changes.
- **Deleting a page is safe-ish:** for the main pages, if you delete one the site
  quietly falls back to a built-in copy (it won't show a broken page) — but you'd
  lose your edits, so prefer editing over deleting.

---

## 3. Adding images (anywhere)

Upload images to WordPress and reuse them by URL:

1. WordPress → **Media → Add New** → upload the image.
2. Click the uploaded image → on the right, use **"Copy URL to clipboard"** (or
   copy the **File URL**). It looks like
   `https://cms.texasspark.org/wp-content/uploads/2026/06/sticker.jpg`.
3. Use that URL wherever a URL is asked for (e.g., the product spreadsheet), or
   just insert the image directly into a page with the **Image** block.

Keep files reasonably sized (large photos slow pages down). The images live in
WordPress — there's nothing else to sign up for.

---

## 4. The shop & products (WooCommerce)

Products are managed in WordPress and appear at **[/shop](https://texasspark.org/shop)**.

**Adding products — three ways, easiest first:**
1. **One at a time:** Products → **Add New** → fill in name, price, description,
   set the image (Media picker), **Publish**. Best for a handful.
2. **Bulk via spreadsheet:** fill in
   [`product-import-template.csv`](./product-import-template.csv), then WordPress →
   Products → **Import** → upload it. It's a guided wizard and pulls images from
   the URLs you provide. Best for many at once, and fully self-serve.
3. **Hand it to your developer:** send the filled spreadsheet and they'll bulk-
   publish via the API (this has been tested and works).

**Product types** (so you pick the right one):
- **Simple** — one item, one price (a sticker, a book).
- **Variable** — one product with options like size/color, each its own
  price/stock (a shirt in S/M/L). *The fiddly one — for these, just describe the
  options and have your developer set them up.*
- **External / Affiliate** — listed here, but "buy" links out to a partner.
- **Virtual / Downloadable** — no shipping / a file delivered after checkout
  (digital toolkits, guides).

**Product images:** use Media Library URLs (Section 3). First URL = main photo;
extra URLs (comma-separated, in quotes) = the gallery.

**Orders:** WooCommerce → **Orders** shows everything purchased. Payments are
handled by Stripe (Section 6).

---

## 5. Newsletter (planned — tool being finalized)

**What it does:** the signup boxes around the site collect email addresses into a
mailing list. From there, the team composes and sends newsletters. Every signup is
also recorded in our analytics database, so no subscriber is ever lost regardless
of the sending tool.

**Status:** the *collection* side is built and working. The *sending* side needs a
one-time setup of an email service — we're finalizing whether that's **MailPoet**
(manage + send entirely inside WordPress) or **Resend** (a hosted service).
Either way, the experience for the team is "compose a newsletter, pick the list,
hit send."

**One thing to know (dev):** the website's server can't send email by itself
(its host blocks the raw mail port), so sending always goes through a real email
provider over a secure port. That's a one-time configuration, invisible to the
team once set.

---

## 6. Donations (Stripe)

The **[/donate](https://texasspark.org/donate)** page takes donations on-site (the
donor never leaves the site), powered by **[Stripe](https://dashboard.stripe.com)**.
Preset amounts plus a custom amount, one-time, with an email receipt.

**Why Stripe:** it was chosen deliberately as a **politically neutral payment
processor** — some processors have refused service to advocacy/political
organizations, and Stripe is a stable, neutral option for this work.

**Keep in mind:**
- **Test vs Live mode:** Stripe has a test mode (fake cards like `4242 4242 4242
  4242`) and a live mode (real money). Make sure you're in **Live** before
  launch, with live keys set.
- **Where donations show up:** in the [Stripe Dashboard](https://dashboard.stripe.com)
  (with donor email + receipt) and in our analytics database.
- **Editing the donation page copy/amounts (dev):** the preset amounts and page
  text are in code (`/donate`), not WordPress — ask your developer to change them.

### Transitioning from B-59's Stripe to Spark's own Stripe (dev)

Donations currently run through **B-59's** Stripe account. To move them to
**Spark's own** account (Stripe accounts can't be transferred — you create a new
one):

1. Spark creates + activates a Stripe account at <https://dashboard.stripe.com>
   (business details + bank account for payouts).
2. Copy Spark's **API keys** (Developers → API keys).
3. **Donations:** replace `STRIPE_SECRET_KEY` and
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in Doppler/Vercel with Spark's keys;
   recreate the webhook in Spark's Stripe dashboard pointing at
   `https://texasspark.org/api/webhooks/stripe` (event `payment_intent.succeeded`)
   and update `STRIPE_WEBHOOK_SECRET`; redeploy.
4. **Store:** WordPress → WooCommerce → Settings → Payments → Stripe → enter
   Spark's keys and reconfigure its webhook.
5. Test a donation and a test order on the new account.
6. **Note:** past/in-flight donations stay in the B-59 account; only new ones go
   to Spark's. Reconcile and pay out the old account separately.

---

## 7. Toolkits (year-round organizing)

The **[/toolkits](https://texasspark.org/toolkits)** section introduces the
year-round organizing model and lists the **9 toolkits**. Each toolkit has its own
WordPress page, started as a **draft** for the team to write and **Publish** when
ready. (PAL is being split into three of those toolkits.) Edit them like any other
page; publish when they're ready to go live.

---

## 8. Who does what

- **You / the team:** content — pages, products, newsletter, the toolkit drafts.
- **Your developer:** the home page, new pages/sections, design, and one-time
  setup (turning on donations/shop/newsletter, domain changes, the items marked
  **(dev)**).

---

## 9. Where the site lives (dev)

The site is on **texasspark.org**, the CMS on **cms.texasspark.org**. DNS is in
**Cloudflare** (the nameservers point there), *not* DigitalOcean; the front end
is a [Vercel](https://vercel.com) project and the CMS is a DigitalOcean droplet
running **Caddy v2 + php-fpm** with a Cloudflare Origin Certificate.

Settings that carry the domain, and what each one drives:

- **`NEXT_PUBLIC_SITE_URL`** = `https://texasspark.org` — canonical links, social
  previews, the sitemap.
- **`NEXT_PUBLIC_LOGIN_URL`** = `https://login.texasspark.org` — the header Log In link.
- **`WORDPRESS_API_URL`** / **`WOOCOMMERCE_API_URL`** / **`MAILPOET_API_BASE_URL`**
  = `https://cms.texasspark.org` — every call the front end makes into the CMS.
- **Stripe webhook** → `https://texasspark.org/api/webhooks/stripe`;
  **WooCommerce order webhook** → `https://texasspark.org/api/webhooks/woocommerce`.
  Both are dormant until payments are turned on.
- **Email "from" domain** (newsletter + receipts): `texasspark.org`, verified in
  Resend via its own DNS records.

All of these live in **Doppler** (synced to Vercel), never in a file here — see
section 10.

- **Reaching the CMS:** `headless-redirect.php` sends the bare CMS domain straight
  to the dashboard (the WordPress login if you're signed out), so you open it by
  typing the domain alone — no `/wp-admin/` needed.

---

## 10. A note on secrets (dev)

All passwords, API keys, and tokens live in **Doppler** (synced to
[Vercel](https://vercel.com)) — never in a file in the project, an email, or a
chat message. If a key is ever exposed, rotate it in its own dashboard and update
Doppler. (A rotation checklist from setup lives in the team's internal notes.)

---

## 11. Quick links

| What | Link |
| --- | --- |
| Public website | <https://texasspark.org> |
| Edit content (WordPress admin) | <https://cms.texasspark.org/wp-admin/> |
| Donate page | <https://texasspark.org/donate> |
| Shop | <https://texasspark.org/shop> |
| Stripe (payments) | <https://dashboard.stripe.com> |
| Hosting (Vercel) | <https://vercel.com> |
| Email (Resend) | <https://resend.com> |
| Database (Neon) | <https://neon.tech> |
| Secrets (Doppler) | <https://dashboard.doppler.com> |
| CDN/DNS (Cloudflare) | <https://dash.cloudflare.com> |

---

*Companion docs in this folder: [CLIENT-ONBOARDING.md](./CLIENT-ONBOARDING.md)
(short editing guide), [HANDOFF.md](./HANDOFF.md) (activation checklist),
[product-import-template.csv](./product-import-template.csv).*
