<?php
/**
 * Plugin Name: TX*SPARK Headless Redirect
 * Description: Sends anyone who lands on the bare CMS domain straight to the
 *              dashboard (anonymous visitors get the WordPress login), while
 *              leaving wp-admin, login, the REST API, the MCP endpoint, and cron
 *              fully reachable. Headless installs don't serve a public theme —
 *              this lets the team open the CMS by typing the domain alone, with
 *              no /wp-admin/ suffix.
 *
 * Install: copy this file to wp-content/mu-plugins/ on the WordPress server
 * (create the mu-plugins folder if it doesn't exist). Must-use plugins load
 * automatically — there's nothing to activate.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('template_redirect', function () {
    // Never redirect admin, login, REST (incl. the MCP endpoint), cron, AJAX, or CLI.
    if (
        is_admin()
        || (defined('REST_REQUEST') && REST_REQUEST)
        || (defined('DOING_CRON') && DOING_CRON)
        || (defined('WP_CLI') && WP_CLI)
        || (function_exists('wp_doing_ajax') && wp_doing_ajax())
    ) {
        return;
    }

    // Let signed-in editors preview the front-end if they ever need to.
    if (is_user_logged_in()) {
        return;
    }

    // Headless install: there is no public theme. Send anyone who lands on the
    // bare CMS domain straight to the dashboard — an anonymous visitor simply
    // gets the WordPress login. This is what lets the team open the CMS by typing
    // the domain alone, no /wp-admin/ suffix. admin_url() tracks the WordPress
    // Site Address, so this keeps working across a domain change with no edit
    // here — it followed the move to cms.texasspark.org on its own.
    wp_redirect(admin_url(), 302);
    exit;

    // Prefer sending strays to the public marketing site instead? Replace the two
    // lines above with:  wp_redirect('https://www.texasspark.org', 302); exit;
});
