import config from '../config';
import { referrer } from './utils/parse_link';

/**
 * Ad 3 media visitior session.
 *
 * Creates unique session id per visit.
 */
let __session = (() => {
    if (window.__amvs) return window.__amvs;

    const range = {
        min: 2,
        max: 10
    };

    const randomInt = Math.floor(Math.random() * (range.max - range.min) + range.min);

    return window.__amvs = Math.random().toString(36).slice(randomInt);
})();

/**
 * Add keys from object obj2 to obj1.
 */
let mergeObjects = (obj1, obj2) => {
    Object.keys(obj2).forEach((key) => {
        obj1[key] = obj2[key];
    });

    return obj1;
};

/**
 * Transform object key:value pairs
 * in a url query.
 */
let objectToQuery = (obj) => {
    const inline = [];

    Object.keys(obj).forEach((key) => {
        inline.push(`${key}=${obj[key]}`);
    });

    if (!inline.length) {
        return ''
    }

    return inline.join('&');
}

class Tracker {
    constructor() {
        this.start = Date.now();

        this._path = config.app_path + '/track';

        this.data = {
            _s: __session,
            referrer: referrer.link.complete,
        };
    }

    app(campaign, status) {
        this.data.campaign = campaign;

        this._track({
            source: 'app',
            campaign,
            status
        });
    }

    manager(tag, status, statusInfo) {
        this._tag(tag, 'manager', status, statusInfo);
    }

    ad(tag, status, statusInfo) {
        this._tag(tag, 'ad', status, statusInfo);
    }

    _tag(tag, source, status, statusInfo = '') {
        this._track({
            tag,
            source,
            status,
            statusInfo
        });
    }

    _track(data) {
        data = mergeObjects(data, this.data);

        // @todo: based on cookie?
        if (1 == 2) {
            console.log(data)
        }

        if (config.tracking) {
            const image = new Image;
            image.src = `${this._path}?${objectToQuery(data)}`;
        }
    }
}

export default (() => {
    return new Tracker();
})();
