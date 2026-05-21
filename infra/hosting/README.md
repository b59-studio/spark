# Server hosting templates

Choose **one** provider for the WordPress CMS host. The Next.js marketing site
can stay on Vercel while WordPress runs on a VPS or managed PHP host.

| Provider | Folder | Best for |
| -------- | ------ | -------- |
| DigitalOcean | `digitalocean/` | Full control, Docker, predictable pricing |
| Cloudways | `cloudways/` | Managed PHP/WordPress, less ops |

## What runs where

| Service | Typical host |
| ------- | ------------ |
| Next.js (`npm run build`) | Vercel (existing) or DO App Platform |
| WordPress + MailPoet + WooCommerce | DO Droplet or Cloudways server |
| Postgres / map app | Neon (see `map-migration/`) |

## Shared checklist (either provider)

1. PHP 8.2+ with extensions: `mysqli`, `curl`, `gd`, `intl`, `mbstring`, `zip`
2. HTTPS (Let's Encrypt)
3. MySQL 8 or MariaDB 11
4. Backups (DB + `wp-content/uploads`)
5. Staging subdomain (`staging.cms.example.org`)
6. Firewall: 22 (SSH), 80, 443 only
7. Point `WORDPRESS_API_URL` / `MAILPOET_API_BASE_URL` at the CMS origin

See provider-specific READMEs for provisioning steps.
