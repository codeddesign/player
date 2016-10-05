/**
 * Make adjustments to data
 * when build is debug
 */

export default (data) => {
    if (ENVIRONMENT != 'debug') {
        return data;
    }

    if (window.__type) {
        data.info.type = window.__type;
    }

    if (window.__tag) {
        const tag = window.__tag;

        data.tags = {
            general: {
                desktop: [tag.desktop],
                mobile: [tag.mobile]
            },
            stream: {
                desktop: [tag.desktop],
                mobile: [tag.mobile]
            }
        };
    }

    return data;
};
