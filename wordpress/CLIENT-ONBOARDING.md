# TX*SPARK website — editing guide & transition notes

This guide is for the TX*SPARK team. It explains **what you manage in
WordPress** and **what changed** in the recent cleanup.

---

## How the site is set up (in plain terms)

There are two parts:

1. **The public website** — what visitors see (the marketing site). Its pages are
   custom-designed in code: panels, card grids, the toolkit carousel, the events
   calendar, the signup boxes.
2. **WordPress** — where you manage the **mailing list** and the **shop
   products**. It lives at **`https://cms.jfseamus.com/wp-admin/`**.

**Page wording is not edited in WordPress.** It was for a while, and the result
was that every page lost its design — WordPress can only send over plain
paragraphs, so the framed panels, the card grids, the toolkit carousel, the
events calendar, and the buttons all disappeared behind flat text. The custom
designs are back, and page copy changes go through your developer.

> WordPress also has its own plain-looking website at `cms.jfseamus.com`. Ignore
> it — visitors are automatically redirected away from it. It's just the engine
> room; the public never sees it.

---

## Logging in

1. Go to **`https://cms.jfseamus.com/wp-admin/`**.
2. Sign in with your WordPress username and password.

---

## What you manage in WordPress

| Thing | Where in WordPress | Shows up on the public site |
| --- | --- | --- |
| **Mailing list** — subscribers, campaigns | MailPoet | The signup boxes feed this list |
| **Shop products** — names, prices, photos, stock | WooCommerce → Products | `/shop` and each product page, within ~2 minutes |

Everything else on the public site — the wording, the layout, the pages
themselves — is custom-designed in code. Send those changes to your developer.

The **Pages** section of WordPress still holds a plain-text copy of the site
wording from the cleanup. Nothing on the public site reads it any more, so
editing a page there has no effect. It's a reference copy, not a control panel.

---

## Which web address is which page

| Web page | What's on it |
| --- | --- |
| `/about` | About TX*SPARK — the value-proposition tabs and section cards |
| `/about/mission` | Mission — four framed sections and the closing quote |
| `/about/people` | People — the four-step "How we work" grid |
| `/about/partners` | Partners — partner resources plus the three-card CTA row |
| `/about/data` | Data integrity |
| `/about/privacy` | Privacy Policy |
| `/about/terms` | Terms of Use |
| `/about/sitemap` | Sitemap — generated from the site's own routes |
| `/work` | Work |
| `/toolkits` | Toolkits — the six-step organizing-cycle carousel and overview |
| `/events` | Events — the Google Calendar embed and mailing-list signup |

---

## What changed in the cleanup

- **"Solutions", "GROW", and "PAL" were retired** and folded into one section:
  **Toolkits** (the year-round organizing model). Old links like `/solutions`,
  `/grow`, and `/pal` now automatically forward to `/toolkits`, so no existing
  link breaks.
- **The Toolkits section** shows the six-step organizing-cycle carousel and an
  overview of the year-round model. The nine individual toolkit guides are still
  to be written. (PAL is being split into three of them.)
- **Page wording moved to WordPress and then moved back.** Routing the pages
  through WordPress flattened them into plain paragraphs, so the designs are
  back in code and page copy changes go through your developer. Send them the
  wording you want and they'll put it in.

## Things to know

- **Newsletter signups still work.** The signup boxes on the site connect to
  your MailPoet mailing list in WordPress.
- **One feature was intentionally dropped:** the old toolkit pages used to ask
  for an email before showing resource downloads (a lead-capture). That gate is
  gone — toolkit resources will be open. If you want to collect emails on the
  toolkits again later, your developer can add a signup box.
- **Rolling back:** every previous version of the site is saved in version
  control, so anything here can be restored if needed — including handing a
  specific page back to WordPress, if you decide plain text is the right
  trade-off for that one page.

---

## Who to contact

For anything outside the mailing list and the shop catalogue — page wording,
new sections, design changes, or the newsletter/donation setup — contact your
developer.
