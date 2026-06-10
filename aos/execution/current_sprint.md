# Current Sprint

<!-- Update weekly or when the sprint changes. -->

## Sprint Goal

Connect the TX\*SPARK marketing site to the WordPress.org backend — enabling
the WooCommerce store and establishing the CMS-driven page authoring workflow
so the team can edit content pages (team roster, newsletter) without deploying
code.

## Success Criteria

- [ ] WordPress.org site linked and authenticating correctly with the Next.js frontend (ADR 0002)
- [ ] WooCommerce store accessible and functional end-to-end
- [ ] Team page editable via WordPress CMS without a code deploy
- [ ] Newsletter page editable via WordPress CMS without a code deploy
- [ ] Staging CMS URL documented in the team secret store

## Active Initiatives

| Initiative | Status | Notes |
|---|---|---|
| WordPress.org integration | 🔄 In progress | Core sprint goal |
| WooCommerce store setup | ⬜ Not started | Unblocks after WP link is live |
| CMS page authoring (team, newsletter) | ⬜ Not started | Unblocks after WP link is live |
| AOS memory layer initialization | ✅ Done | Completed this session |

## Sprint Backlog

- [ ] Re-enable temporarily disabled routes (e.g. `/contact`) when ready (ADR 0001)
- [ ] Document staging CMS URL in the team secret store (ADR 0002)
- [ ] Map stack merge decision (ADR 0004) — deferred to next sprint

## Out of Scope This Sprint

- Map stack merge (decision + PR deferred until after WP integration lands)
- OpenAPI spec for public API routes (deferred until the API surface grows)
