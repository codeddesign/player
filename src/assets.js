import $ from './utils/element';
import source from './source';

/**
 * Inserts assets required by player.
 */
class Assets {
    constructor() {
        let self = this;

        this.head = $().find('head');

        this._list = [{
            name: 'youtube',
            tag: 'script',
            attributes: { src: 'https://www.youtube.com/iframe_api' }
        }, {
            name: 'ima',
            tag: 'script',
            attributes: { src: '//imasdk.googleapis.com/js/sdkloader/ima3.js' },
            events: {
                oncomplete() {
                    // Even though it's loaded it takes few mls for google variable to be available
                    self._waitForGoogle();
                }
            }
        }, {
            name: 'css',
            tag: 'link',
            attributes: { rel: 'stylesheet', href: `${source.path}css/style.css` }
        }, {
            name: 'glyph',
            tag: 'link',
            attributes: { rel: 'stylesheet', href: `${source.path}css/glyphter-font/css/adzicons.css` }
        }];

        this.asset = null;
    }

    add(imaReady) {
        this.imaReady = imaReady;

        this._list.forEach((asset) => {
            this.asset = asset;

            this.__addOne();
        });
    }

    _googleIsReady() {
        return typeof google !== 'undefined';
    }

    _waitForGoogle() {
        let interval = setInterval(() => {
            if (this._googleIsReady()) {
                clearInterval(interval);

                this.imaReady();
            }
        }, 1);
    }

    __addOne() {
        const asset = this.asset,
            attr = (asset.attributes['href']) ? 'href' : 'src',
            selector = `${asset.tag}[${attr}="${asset.attributes[attr]}"]`,
            exists = $().find(selector, false);

        if (!exists) {
            this.head.addChild(asset.tag, asset.attributes, asset.events);

            return this;
        }

        if (asset.name == 'ima') {
            this._waitForGoogle();

            return this;
        }
    }
}

export default () => {
    return new Assets;
};
