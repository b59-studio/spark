# TX*SPARK website — editing guide & transition notes

This guide is for the TX*SPARK team. It explains **how to edit the website
yourself** and **what changed** in the recent cleanup. You don't need to touch
code — most page content now lives in WordPress, and your edits appear on the
public site automatically.

---

## How the site is set up (in plain terms)

There are two parts:

1. **The public website** — what visitors see (the marketing site).
2. **WordPress** — where you log in and edit the words on those pages. It lives
   at **`https://cms.jfseamus.com/wp-admin/`**.

You edit a page in WordPress, click **Update**, and within about a minute the
change shows up on the public site. No developer needed.

> WordPress also has its own plain-looking website at `cms.jfseamus.com`. Ignore
> it — visitors are automatically redirected away from it. It's just the engine
> room; the public never sees it.

---

## Logging in

1. Go to **`https://cms.jfseamus.com/wp-admin/`**.
2. Sign in with your WordPress username and password.
3. In the left menu, click **Pages** to see everything you can edit.

---

## Editing a page

1. **Pages** → click the page you want (e.g. "Mission").
2. Edit the text. You can add headings, bold, links, and lists with the toolbar.
3. Click **Update** (top right).
4. Wait ~1 minute, then refresh the public page to see your change.

**Published vs. Draft:** the public site only shows **Published** pages. If a
page is a **Draft**, it stays hidden until you click **Publish**. (See the list
below for which pages are currently drafts.)

---

## Which WordPress page controls which web address

| Web page | WordPress page to edit | Status |
| --- | --- | --- |
| `/about` | About TX*SPARK | Published |
| `/about/mission` | Mission | Published |
| `/about/people` | People | Published |
| `/about/partners` | Partners | Published |
| `/about/data` | Data integrity | Published |
| `/about/privacy` | Privacy Policy | Published |
| `/about/terms` | Terms of Use | Published |
| `/about/sitemap` | Sitemap | Published |
| `/work` | Work | Published |
| `/toolkits` | Toolkits | Published |
| `/events` | Events | **Draft** — see note below |
| Each toolkit | "Get To Know Your Precinct", etc. (9 toolkit pages) | **Draft** |

The **home page** is not editable in WordPress — it's a custom design. Ask your
developer for home-page changes.

---

## What changed in the cleanup

- **"Solutions", "GROW", and "PAL" were retired** and folded into one section:
  **Toolkits** (the year-round organizing model). Old links like `/solutions`,
  `/grow`, and `/pal` now automatically forward to `/toolkits`, so no existing
  link breaks.
- **The Toolkits section** currently shows a general overview of the year-round
  organizing model and lists the **9 toolkits**. Each toolkit has its own
  WordPress page, started as a **draft** for your team to write and publish when
  ready. (PAL is being split into 3 of those toolkits — one has starter content,
  two are placeholders.)
- **Most pages are now editable by you** in WordPress (the table above).
- **Events** is editable too. For now the live Events page still shows the
  Google Calendar and mailing-list signup. When you publish the "Events"
  WordPress page, your editable version replaces that.

## Things to know

- **Newsletter signups still work.** The signup boxes on the site connect to
  your MailPoet mailing list in WordPress.
- **One feature was intentionally dropped:** the old toolkit pages used to ask
  for an email before showing resource downloads (a lead-capture). That gate is
  gone — toolkit resources will be open. If you want to collect emails on the
  toolkits again later, your developer can add a signup box.
- **Rolling back:** every previous version of the site is saved in version
  control, so anything here can be restored if needed.

---

## Who to contact

For anything that isn't editable in WordPress (the home page, new sections,
design changes, or the newsletter/donation setup), contact your developer.
