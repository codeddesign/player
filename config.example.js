export default {
    app_path: 'http://ad3media.com',
    fb_appId: 000000000000000,
    sentry: 'https://123d12345efg12345a1f12aa1234d1234@sentry.io/12345', // to disable sentry set the value to false, without quotes.
    lockerdome_slot: 1111111111111111,
    lockerdome_pixels: -50,
    tracking: true,
    animator_fps: 60, // frames per second for iphone inline
    ignore_flash: false,
    delay: {
        aclose: 3 // seconds before showing ad close icon
    },
    ima: {
        timeout: 6, // seconds
        max_redirects: 10, // max number of redirects for vast tags
        vpaid_mode: 1, // {DISABLED: 0, ENABLED: 1, INSECURE: 2}
        request: {
            delay: 1, // tag request delay in seconds. E.g.: use .5 or 1/2 for half a second.
            max: 2 // max # of attempts (applies for dev environment only)
        }
    },
    priority_rules: {
        tubemogul: 1,
        aol: 2,
        adap: 2,
        beachfront: 3,
        tremor: 4
    },
};
