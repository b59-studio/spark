<?php
/**
 * Plugin Name: TX*SPARK Cloudflare Real IP
 * Description: Restores the real visitor IP from Cloudflare's CF-Connecting-IP
 *              header so WordPress — and IP-based plugins like Jetpack's
 *              brute-force "Protect" login challenge — see the actual client
 *              instead of a Cloudflare edge IP.
 *
 *              Why this exists: behind the Cloudflare proxy, REMOTE_ADDR is a
 *              Cloudflare IP, not the visitor's. Jetpack Protect keys its math
 *              challenge on that IP, so it (a) challenges EVERY login (the shared
 *              proxy IP is never "trusted") and (b) intermittently rejects the
 *              answer and logs the user straight back out, because Cloudflare
 *              presents a DIFFERENT egress IP across the login handshake (GET the
 *              form -> POST credentials -> land on /wp-admin/). Giving WordPress
 *              the real IP makes the challenge stable and stops the logout.
 *
 *              The header is trusted ONLY when the connecting IP (REMOTE_ADDR) is
 *              within a published Cloudflare range, so a request sent directly to
 *              the origin (bypassing Cloudflare) cannot spoof it. Refresh the CIDR
 *              lists from https://www.cloudflare.com/ips/ if Cloudflare changes them.
 *
 * Install: copy this file to wp-content/mu-plugins/ on the WordPress server
 * (alongside headless-redirect.php). Must-use plugins load automatically and
 * early — before Jetpack reads the IP — so there is nothing to activate.
 */

if (!defined('ABSPATH')) {
    exit;
}

(function () {
    $cf_ip  = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '';
    $remote = $_SERVER['REMOTE_ADDR'] ?? '';

    // No Cloudflare header (e.g. local Docker dev) or a malformed value -> leave
    // REMOTE_ADDR exactly as-is.
    if ($cf_ip === '' || $remote === '' || filter_var($cf_ip, FILTER_VALIDATE_IP) === false) {
        return;
    }

    // Official Cloudflare edge ranges — https://www.cloudflare.com/ips/
    $cf_ranges = [
        // IPv4
        '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22',
        '141.101.64.0/18', '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20',
        '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
        '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
        // IPv6
        '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32',
        '2405:8100::/32', '2a06:98c0::/29', '2c0f:f248::/32',
    ];

    $in_range = static function (string $ip, string $cidr): bool {
        [$subnet, $bits] = explode('/', $cidr);
        $bits    = (int) $bits;
        $ip_bin  = @inet_pton($ip);
        $sub_bin = @inet_pton($subnet);
        // inet_pton returns 4 bytes for IPv4, 16 for IPv6; mismatched lengths mean
        // different families and therefore no match.
        if ($ip_bin === false || $sub_bin === false || strlen($ip_bin) !== strlen($sub_bin)) {
            return false;
        }
        $whole = intdiv($bits, 8);   // number of fully-masked bytes
        $rem   = $bits % 8;          // leftover bits in the next byte
        if ($whole > 0 && strncmp($ip_bin, $sub_bin, $whole) !== 0) {
            return false;
        }
        if ($rem === 0) {
            return true;
        }
        $mask = chr((0xff << (8 - $rem)) & 0xff);
        return (ord($ip_bin[$whole]) & ord($mask)) === (ord($sub_bin[$whole]) & ord($mask));
    };

    foreach ($cf_ranges as $cidr) {
        if ($in_range($remote, $cidr)) {
            // Connection genuinely came from Cloudflare -> the CF-Connecting-IP is
            // the real visitor. Rewrite REMOTE_ADDR so core and every plugin see it.
            $_SERVER['REMOTE_ADDR'] = $cf_ip;
            return;
        }
    }
    // REMOTE_ADDR is NOT a Cloudflare address: the request reached the origin
    // directly, so the header is untrusted — leave REMOTE_ADDR untouched.
})();
