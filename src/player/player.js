import Campaign from './campaign';
import Tag from './tag';
import youtube from './google/youtube';
import createTemplate from './view/create_template';
import addGeneralListeners from './view/general_listeners';
import addStandardListeners from './view/standard_listeners';
import addOnscrollListeners from './view/onscroll_listeners';
import addSidebarInifinityListeners from './view/sidebarinfinity_listeners';
import prioritizeTags from '../utils/prioritize_tags';
import device from '../utils/device';
import sizeFromWidth from '../utils/size_from_width';
import random from '../utils/random';

/**
 * Setup and initialization.
 *
 * @todo: come up with a better strategy for google's
 * api variables (google & YT.player) - maybe promises ?
 */
class Player {
    constructor(data) {
        this.campaign = new Campaign(data);

        this.$el = false;
        this.$els = [];
        this.$hovering = false;

        this.mainTag = false;
        this._tags = [];
        this._tagsRequested = 0;
        this._tagsLoaded = 0;

        this._youtube = false;
        this._youtubeReady = false;

        this._disabled = false;
        this._requestsStopped = false;

        this.playing = false;

        this.__setTemplateElements()
            .__setTemplateListeners()
            .__setView()
            .__setYoutube()
            .__requestTags();
    }

    play() {
        // interrupt if youtube is playing
        if (this._youtube && this._youtubeReady && this._youtube.wasPlayed()) {
            return this;
        }

        if (!this.isDisabled() && !this.playing) {
            this._tags.forEach((tag) => {
                if (this.mainTag && this.mainTag.ima.destroyed && !tag.ima.destroyed) {
                    this.mainTag = tag;
                }

                if (this.mainTag && this.mainTag.ima.loaded && !this.mainTag.ima.started) {
                    this.playing = true;

                    this.mainTag.ima.play();
                }
            });
        }

        if (!this.playing) {
            this.youtubePlay();
        }

        return this;
    }

    youtubePlay() {
        if (!this._youtube) {
            return this;
        }

        this.playing = true;

        this.disable();

        this.$els.youtube.show();

        if (!device.isMobile()) {
            this._youtube.play();
        }

        return this;
    }

    onManagerLoad(tag) {
        this._tagsRequested++;

        if (tag) {
            tag.ima.initialize();
        }

        if (this.tagsReady()) {
            if (this.campaign.isStandard()) {
                this.$els.playmain.show();
            }
        }
    }

    onAdLoad(tag) {
        this._tags.push(tag);

        this._tags = prioritizeTags(this._tags);

        this._tags.forEach((tag, index) => {
            // set first tag
            if (!this.mainTag) {
                this.mainTag = tag;
            }

            // hide the rest
            if (this.mainTag != tag) {
                tag.ima._$el.hide();
            }
        });
    }

    onYoutubeReady() {
        this._youtubeReady = true;
    }

    tagsReady() {
        return this._tagsRequested >= this.campaign.tags().length;
    }

    size() {
        if (this.campaign.isStandard()) {
            return this.$el.size();
        }

        if (this.campaign.isSidebarInfinity()) {
            return sizeFromWidth(300);
        }

        if (!this.campaign.size()) {
            throw Error('Failed to determine size');
        }

        return this.campaign.size();
    }

    tagsLeft() {
        let loaded = 0;
        this._tags.forEach((tag) => {
            if (!tag.ima.destroyed) {
                loaded++;
            }
        });

        return loaded;
    }

    disable() {
        this._disabled = true;

        this.stopRequests();

        return this;
    }

    isDisabled() {
        return this._disabled;
    }

    stopRequests() {
        this._requestsStopped = true;

        return this;
    }

    requestsStopped() {
        return this._requestsStopped;
    }

    /**
     * Constructor setup methods.
     */

    __setTemplateElements() {
        const template = createTemplate(this.campaign);

        this.$el = template.$el;
        this.$els = template.$els;

        this.$hovering = template.$el.findAll('.hovering');

        return this;
    }

    __setTemplateListeners() {
        addGeneralListeners(this);

        if (this.campaign.isStandard()) {
            addStandardListeners(this);
        }

        if (this.campaign.isOnscroll() || this.campaign.isSidebarInfinity()) {
            addOnscrollListeners(this);
        }

        if (this.campaign.isSidebarInfinity()) {
            addSidebarInifinityListeners(this);
        }

        return this;
    }

    __setView(campaign) {
        this.$el.show();
        this.$els.container.show();

        if (device.isMobile()) {
            this.$els.container.addClass('mobile');

            if (device.isIGadget()) {
                this.$els.container.addClass('iDevice');
            }
        }

        if (this.__isSliding()) {
            this.$els.container.asSlided();
        }

        if (this.__isFading()) {
            this.$els.container.asFaded();
        }

        if (this.campaign.isStandard()) {
            this.$els.logo.show();
            this.$els.overlay.show();
        }

        if (this.campaign.isSidebarInfinity()) {
            this.$el.addClass('sidebar');
            this.$els.filler.addClass('sidebar');

            // set fix sizes for main element and player container
            this.$el.setSizes({ width: 300, height: 169 });
            this.$els.container.setSizes(sizeFromWidth(300));

            // specific margin left for fixed
            //this.$el.style('marginLeft', (this.$el.offsetLeft() - this.$el.parent().offsetLeft()) + 'px');

            // show filler
            this.$els.filler.show().asFaded().fadeIn();

            // add fixed if not in view and scrolled
            if (this.$el.parent().bounds().top <= 0) {
                this.$el.addClass('fixed');
            }
        }

        return this;
    }

    __requestTags() {
        this.mainTag = false;

        // don't load any tags if sidebar infinity and on mobile
        if (this.campaign.isSidebarInfinity() && device.isMobile()) {
            return this;
        }

        this.campaign.tags().forEach((link, index) => {
            const tag = new Tag(link, this);

            tag.request();
        });

        return this;
    }

    __setYoutube() {
        let youtubeIsReady = () => {
            return typeof YT !== 'undefined' && typeof YT.Player !== 'undefined';
        }

        if (this.campaign.isStandard()) {
            const interval = setInterval(() => {
                if (youtubeIsReady()) {
                    clearInterval(interval);

                    this._youtube = youtube(this, this.campaign.videos().url);
                }
            }, 1);
        }

        return this;
    }

    __isSliding() {
        return this.campaign.isOnscroll();;
    }

    __isFading() {
        return this.campaign.isSidebarInfinity();
    }
}

export default Player;
