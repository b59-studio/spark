<?php
/**
 * Plugin Name: TX*SPARK Headless Redirect
 * Description: Sends public front-end visitors to the marketing site, while
 *              leaving wp-admin, login, the REST API, the MCP endpoint, and
 *              cron fully reachable. Headless installs don't serve a public
 *              theme — this keeps anyone who lands on the CMS domain out of it.
 *
 * Install: copy this file to wp-content/mu-plugins/ on the WordPress server
 * (create the mu-plugins folder if it doesn't exist). Must-use plugins load
 * automatically — there's nothing to activate.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('template_redirect', function () {
    // ⬇️ Set this to your public marketing site.
    $marketing_site = 'https://jfseamus.com';

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

    // 302 (temporary) while you settle in; switch to 301 once you're sure.
    wp_redirect($marketing_site, 302);
    exit;
});
