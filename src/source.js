import parse_link from './utils/parse_link';
import $ from './utils/element';

/**
 * Get information about the js element
 * used to create the player.
 */
class Source {
    constructor(script) {
        const link = parse_link(script.src).link,
            matched = link.file_name.match(/\d+/g);

        if (!matched.length) {
            throw new Error('Failed to parse source id.');
        }

        this.id = matched[0];

        this.path = link.simple.replace(link.file_name, '');

        this.script = $(script);
    }
}

export default (() => {
    return new Source(document.currentScript);
})();
