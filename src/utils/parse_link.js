/**
 * Returns file name.
 * Condition is that the last piece of the path contains a 'dot'.
 */
let path_file_name = (path) => {
    const name = path.split('/').pop();

    if (name.includes('.')) {
        return name;
    }

    return '';
}

/**
 * Returns information about a link.
 */
export const parse_link = (path) => {
    const virtual = document.createElement('a');

    virtual.href = path;

    const base = `${virtual.protocol}//${virtual.host}`;
    const simple = `${base}${virtual.pathname}`;
    const complete = `${simple}${virtual.search}${virtual.hash}`;
    const file_name = path_file_name(complete)

    return {
        virtual,
        link: {
            base: base + '/',
            simple,
            complete,
            file_name
        }
    };
};

export const referrer = (() => {
    return parse_link(location.href);
})();
