<?php
/**
 * Plugin Name: TX*SPARK Admin Trailing Slash
 * Description: Redirects the bare /wp-admin to /wp-admin/ (301) so the WordPress
 *              admin menu's RELATIVE links (e.g. "edit.php?post_type=page") always
 *              resolve under /wp-admin/. Loaded without the trailing slash, the
 *              dashboard's document base is "/", so those links resolve to the site
 *              root instead — cms.example.com/edit.php?post_type=page rather than
 *              cms.example.com/wp-admin/edit.php?post_type=page — and every menu
 *              item appears broken. The origin behind the Cloudflare/proxy layer
 *              does not emit the canonical directory-slash redirect, so we do it here.
 *
 * Install: copy this file to wp-content/mu-plugins/ on the WordPress server
 * (alongside headless-redirect.php). Must-use plugins load automatically — there
 * is nothing to activate.
 */

if (!defined('ABSPATH')) {
    exit;
}

// mu-plugins load early in the bootstrap, before the admin auth redirect fires,
// so fixing the slash here happens before the login bounce preserves the wrong
// path in its redirect_to. Match the bare admin root ONLY (exact, no slash) to
// avoid touching /wp-admin/ or deep links like /wp-admin/edit.php, and to avoid
// a redirect loop. A relative Location keeps it same-host with no open-redirect
// surface and no dependency on wp_redirect() (not yet loaded at this point).
$txspark_admin_path = strtok($_SERVER['REQUEST_URI'] ?? '', '?');
if ($txspark_admin_path === '/wp-admin') {
    $query = empty($_SERVER['QUERY_STRING']) ? '' : '?' . $_SERVER['QUERY_STRING'];
    header('Location: /wp-admin/' . $query, true, 301);
    exit;
}
