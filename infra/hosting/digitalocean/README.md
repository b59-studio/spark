# DigitalOcean — WordPress CMS template

> **Live setup note:** the production `cms.jfseamus.com` droplet
> (`167.99.224.49`) runs **Caddy v2 + php-fpm 8.3** serving WordPress from
> `/var/www/html`, behind Cloudflare with a Cloudflare Origin Certificate — see
> [`Caddyfile.example`](./Caddyfile.example). The nginx steps below are the
> original generic template / an alternative, not what is deployed. Firewall:
> ufw allows SSH plus 80/443 **from Cloudflare ranges only**.

## 1. Create a Droplet

- **Image:** Ubuntu 24.04 LTS
- **Size:** 2 GB RAM / 1 vCPU minimum (4 GB recommended with WooCommerce)
- **Region:** closest to your Texas audience (e.g. `dfw1`)
- **Authentication:** SSH keys only

## 2. Initial server setup

```bash
ssh root@YOUR_DROPLET_IP

apt update && apt upgrade -y
apt install -y nginx mariadb-server certbot python3-certbot-nginx ufw
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

## 3. Database

```bash
mysql_secure_installation
mysql -e "CREATE DATABASE wordpress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER 'wpuser'@'localhost' IDENTIFIED BY 'CHANGE_ME';"
mysql -e "GRANT ALL ON wordpress.* TO 'wpuser'@'localhost'; FLUSH PRIVILEGES;"
```

## 4. WordPress

Option A — **Docker** (matches `wordpress/docker-compose.yml`):

```bash
apt install -y docker.io docker-compose-v2
git clone YOUR_REPO /opt/txspark
cd /opt/txspark/wordpress
# Edit compose for production secrets, then:
docker compose up -d
```

Option B — **Classic LEMP:** install PHP-FPM 8.3, download WordPress to `/var/www/cms`, configure Nginx `server_name cms.example.org`.

## 5. TLS

```bash
certbot --nginx -d cms.example.org
```

## 6. Environment on Next.js (Vercel)

Set secrets from `env/site.integrations.example` using your live CMS URL.

## Optional: DO App Platform for Next.js

If you move off Vercel, deploy the repo root as a Node app with build command
`npm run build` and output `.next` per Next.js standalone docs.
