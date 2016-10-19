import device from '../../utils/device';
import Animator from '../../utils/animator';
import config from '../../../config';
import track from '../../tracker';

class Ima {
    constructor(tag) {
        this._tag = tag;
        this._player = tag._player;

        this._$el = false;
        this._$video = false;

        this.error = false;
        this.display = false;
        this.loader = false;
        this.request = false;
        this.manager = false;

        this.initialized = false;
        this.loaded = false;
        this.started = false;
        this.completed = false;
        this.destroyed = false;

        this.animator = false;

        this._setSelector()
            ._setDisplay()
            ._setRequest()
            ._makeRequest();
    }

    initialize(byUser = false) {
        if (this._player.requestsStopped()) {
            return this;
        }

        this._$el.show();

        /**
         * Must not be already initialized AND
         * It needs to be non-mobile OR initialized by user OR already initialized once
         */

        if (!this.initialized && (!device.isMobile() || byUser || this._tag._attempts > 1)) {
            this._player.$el.pub('initialized');

            this.initialized = true;

            this.display.initialize();
            this.manager.init(this._player.size().width, this._player.size().height, google.ima.ViewMode.NORMAL);

            if (this.__startsMuted()) {
                this.manager.setVolume(0);
            }
        }

        return this;
    }

    isSkippable() {
        return this.manager.getCurrentAd().isSkippable();
    }

    play() {
        this.initialize(true);

        if (!this.started) {
            this.manager.start();

            return this;
        }

        if (!this.completed) {
            this.manager.resume();
        }

        return this;
    }

    _setSelector() {
        this._$el = this._player.$els.container.addChild('div', {
            className: 'player__video ad hidden'
        });

        return this;
    }

    _setDisplay() {
        this.display = new google.ima.AdDisplayContainer(this._$el.node, null);

        return this;
    }

    _setRequest() {
        this.request = new google.ima.AdsRequest();
        this.request.adTagUrl = this._tag.link;

        this.request.linearAdSlotWidth = this._player.size().width;
        this.request.linearAdSlotHeight = this._player.size().height;

        this.request.nonLinearAdSlotWidth = this._player.size().width;
        this.request.nonLinearAdSlotHeight = this._player.size().height;

        return this;
    }

    _makeRequest() {
        this.loader = new google.ima.AdsLoader(this.display);

        this.loader.getSettings().setVpaidMode(config.ima.vpaid_mode);
        this.loader.getSettings().setNumRedirects(config.ima.max_redirects);

        this.loader.addEventListener(
            google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            (ev) => {
                // first: set manager
                this._setManager(ev);

                // second: notify player
                this._player.onManagerLoad(this._tag);

                // track
                track.tag(this._tag, 0, 'loaded');
            },
            false
        );

        this.loader.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            (ev) => {
                this.error = ev.getError();
                track.tag(this._tag, this.error.getVastErrorCode(), this.error.getMessage())

                this._player.onManagerLoad();

                this._$el.remove();

                // request tag: with delay
                this._tag.request(true);
            },
            false
        );

        this.loader.requestAds(this.request);

        return this;
    }

    _setManager(ev) {
        // manager settings
        const settings = new google.ima.AdsRenderingSettings();
        settings.restoreCustomPlaybackStateOnAdBreakComplete = true;
        settings.loadVideoTimeout = config.ima.timeout * 1000;
        settings.enablePreloading = true;

        // initiate manager
        this.manager = ev.getAdsManager(
            this._player.$els.youtube,
            settings
        );

        // add ad-error listener
        this.manager.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            this._aError.bind(this)
        );

        // add ad-event listener
        Object.keys(google.ima.AdEvent.Type).forEach((evName) => {
            if (evName == 'DURATION_CHANGE') {
                return false;
            }

            if (evName == 'CONTENT_RESUME_REQUESTED') {
                return false;
            }

            this.manager.addEventListener(
                google.ima.AdEvent.Type[evName],
                this._aEvent.bind(this)
            );
        });
    }

    destroy() {
        if (!this.destroyed) {
            this.destroyed = true;

            if (this.manager) {
                this.manager.destroy();
            }

            this._$el.remove();
        }

        return this;
    }

    _aError(ev) {
        this.error = ev.getError();

        this.destroy();

        this._player.$el.pub('aerror', { tag: this._tag });

        track.ad(this._tag, this.error.getVastErrorCode(), this.error.getMessage());
    }

    _aEvent(ev) {
        track.ad(this._tag, 0, ev.type);

        switch (ev.type) {
            case google.ima.AdEvent.Type.LOADED:
                if (this.__skipFlash()) {
                    this._aError({
                        getError: () => {
                            return {
                                getVastErrorCode: () => 1,
                                getMessage: () => 'Sidebar ignores flash'
                            }
                        }
                    });

                    return false;
                }

                this.loaded = true;

                // first: set as main tag
                this._player.onAdLoad(this._tag);

                // then: trigger loaded
                this._player.$el.pub('loaded');

                // iphone inline
                if (device.isIPhone() && this._player.campaign.isOnscroll()) {
                    this._$el.sub('animator:completed', () => {
                        this.manager.stop();
                    });

                    this.animator = new Animator(this);
                }

                break;
            case google.ima.AdEvent.Type.STARTED:
                this.started = true;

                this._player.$el.pub('started');

                break;
            case google.ima.AdEvent.Type.AD_CAN_PLAY:
                this._player.$el.pub('canplay');

                break;
            case google.ima.AdEvent.Type.SKIPPED:
                this.destroy();

                this._player.$el.pub('skipped');

                break;
            case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                this.destroy();

                this.completed = true;

                this._$el.hide();

                this._player.$el.pub('completed');

                break;
            case google.ima.AdEvent.Type.VOLUME_CHANGED:
                this._player.$els.asound.pub('toggle:sound', { sound: 1 });

                break;
            case google.ima.AdEvent.Type.VOLUME_MUTED:
                this._player.$els.asound.pub('toggle:sound', { sound: 0 });

                break;
        }
    }

    __startsMuted() {
        return this._player.campaign.isOnscroll() ||
            this._player.campaign.isSidebarInfinity();
    }

    __skipFlash() {
        let contentType = '';

        if (this.manager) {
            contentType = this.manager.getCurrentAd().getContentType();
        }

        if (contentType.indexOf('flash') &&
            this._player.campaign.isSidebarInfinity()
        ) {
            return true;
        }

        return false;
    }
}

export default Ima;
