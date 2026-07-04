<?php
/**
 * Plugin Name: TX*SPARK Remember Login Duration
 * Description: When a user ticks "Remember Me" on wp-login.php, keep them signed
 *              in for 30 days instead of the WordPress default of 14. This is the
 *              opt-in "remember this login?" — the user chooses whether to be
 *              remembered; nothing is extended unless they tick the box, and a
 *              login WITHOUT the box keeps WordPress's short default untouched.
 *              Longer remembered sessions mean the content team rarely revisits
 *              the login screen (and its Jetpack bot-check) at all.
 *
 * Install: copy this file to wp-content/mu-plugins/ on the WordPress server
 * (alongside headless-redirect.php). Must-use plugins load automatically — there
 * is nothing to activate.
 */

if (!defined('ABSPATH')) {
    exit;
}

// How long a "Remember Me" session lasts, in days. WordPress core default is 14.
// Raising this trades a longer convenience window against a larger exposure
// window if a device is lost — 30 is a common middle ground for a small team.
if (!defined('TXSPARK_REMEMBER_DAYS')) {
    define('TXSPARK_REMEMBER_DAYS', 30);
}

add_filter('auth_cookie_expiration', static function ($length, $user_id, $remember) {
    // Extend ONLY when the user opted in via the "Remember Me" checkbox.
    // Un-remembered logins keep WordPress's short default ($length) unchanged.
    return $remember ? TXSPARK_REMEMBER_DAYS * DAY_IN_SECONDS : $length;
}, 10, 3);
