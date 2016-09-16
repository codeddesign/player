import Ima from './google/ima';
import parse_link from '../utils/parse_link';
import device from '../utils/device';

/**
 * Acts like a model for the tags.
 */
class Tag {
    constructor(link, player) {
        this.link = link;
        this.ima = false;

        this._player = player;

        this._setLink();
    }

    request() {
        this.ima = new Ima(this);

        return this;
    }

    contains(find = false) {
        if (!find) {
            throw Error('Tag\'s match string can\t be empty');
        }

        return this.link.toLowerCase().indexOf(find.toLowerCase()) !== -1;
    }

    _setLink() {
        const referrer = parse_link(location.href);

        const mapped = {
            '[width]': this._player.size().width,
            '[height]': this._player.size().height,
            '[timestamp]': Date.now(),
            '[referrer_root]': encodeURIComponent(referrer.link.base),
            '[referrer_url]': encodeURIComponent(referrer.link.complete),
            '[user_agent]': device.agent,
            '[ip_address]': ''
        };

        Object.keys(mapped).forEach((key) => {
            this.link = this.link.replace(key, mapped[key]);
        });

        return this;
    }
}

export default Tag;
