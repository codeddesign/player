/**
 * Determine height based on given width.
 *
 * @param {integer} width
 *
 * @return {Object}
 */
export default (width) => {
    const reference = { width: 640, height: 360 },
        height = width * reference.height / reference.width;

    return {
        width,
        height
    };
};
