export default {
    app_path: 'http://ad3media.com',
    fb_appId: 000000000000000,
    sentry: 'https://123d12345efg12345a1f12aa1234d1234@sentry.io/12345', // to disable sentry set the value to false, without quotes.
    tracking: true,
    ima: {
        timeout: 6, // seconds
        max_redirects: 10, // max number of redirects for vast tags
        vpaid_mode: 1 // {DISABLED: 0, ENABLED: 1, INSECURE: 2}
    },
    priority_rules: {
        tubemogul: 1,
        aol: 2,
        adap: 2,
        beachfront: 3,
        tremor: 4
    },
};
