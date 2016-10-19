import Ima from './google/ima';
import { referrer, parse_link } from '../utils/parse_link';
import device from '../utils/device';
import config from '../../config';
import $ from '../utils/element';

/**
 * Acts like a model for the tags.
 */
class Tag {
    constructor(link, player) {
        this.link = link;
        this.name = link;

        this.ima = false;

        this._player = player;

        this._attempts = 0;

        this._setListeners()
            ._setLink()
            ._setName();
    }

    request(delayed = false) {
        // skip if player is disabled
        if (this._player.requestsStopped()) {
            return this;
        }

        // direct request if request is not delayed
        if (!delayed) {
            this._setIma();

            return this;
        }

        // skip delayed requests if it's dev and if it goes over maximum allowed
        if (ENVIRONMENT == 'dev' && this._attempts >= config.ima.request.max) {
            return this;
        }

        // delay request
        setTimeout(() => {
            // skip if happened before timeout
            if (this._player.requestsStopped()) {
                return false;
            }

            this._setIma();
        }, config.ima.request.delay * 1000);

        return this;
    }

    contains(find = false) {
        if (!find) {
            throw Error('Tag\'s match string can\t be empty');
        }

        return this.link.toLowerCase().indexOf(find.toLowerCase()) !== -1;
    }

    _setIma() {
        this.ima = new Ima(this);

        this._attempts++;

        return this;
    }

    _setListeners() {
        $().sub('touchend', () => {
            this.ima.initialize(true);
        });

        return this;
    }

    _setLink() {
        const mapped = {
            '[width]': this._player.size().width,
            '[height]': this._player.size().height,
            '[timestamp]': Date.now(),
            '[referrer_root]': encodeURIComponent(referrer.link.base),
            '[referrer_url]': encodeURIComponent(referrer.link.complete),
            '[description_url]': encodeURIComponent(referrer.link.complete),
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

    _setName() {
        let data = parse_link(this.link).link.data;

        if (data.iu) {
            let parts = data.iu.split('/');

            this.name = parts[parts.length - 1];

            return this;
        }

        this.name = this.link;

        return this;
    }
}

export default Tag;
