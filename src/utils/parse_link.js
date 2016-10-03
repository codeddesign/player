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
 * Transforms link's query to object
 * in format key: value.
 */
let query_to_object = (query) => {
    const data = {};

    query = query.replace('?', '').split('&');

    query.forEach((pair) => {
        pair = pair.split('=');
        data[pair[0]] = pair[1];
    });

    return data;
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
            file_name,
            data: query_to_object(virtual.search)
        }
    };
};

export const referrer = (() => {
    return parse_link(location.href);
})();
