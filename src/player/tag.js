import Ima from './google/ima';
import { referrer } from '../utils/parse_link';
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
        const mapped = {
            '[width]': this._player.size().width,
            '[height]': this._player.size().height,
            '[timestamp]': Date.now(),
            '[referrer_root]': encodeURIComponent(referrer.link.base),
            '[referrer_url]': encodeURIComponent(referrer.link.complete),
            '[user_agent]': device.agent,
            '[ip_address]': this._player.campaign.data.ip
        };

        Object.keys(mapped).forEach((key) => {
            this._replaceKey(key, mapped[key]);
        });

        return this;
    }

    _replaceKey(key, value) {
        key = key.replace('\[', '\\[')
            .replace('\]', '\\]');

        this.link = this.link.replace(new RegExp(key, 'g'), value);

        return this;
    }
}

export default Tag;
