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

        this.__setTemplateElements()
            .__setTemplateListeners()
            .__setView()
            .__setTags()
            .__setYoutube();
    }

    play() {
        if (this.mainTag.ima.loaded && !this.mainTag.ima.error) {
            this.mainTag.ima.play();

            return this;
        }

        this.youtubePlay();

        return this;
    }

    youtubePlay() {
        if (!this._youtube) {
            return this;
        }

        this.$els.youtube.show();

        if (!device.isMobile()) {
            this._youtube.play();
        }

        return this;
    }

    onManagerLoad(tag) {
        this._tagsRequested++;

        if (tag) {
            this._tags.push(tag);
        }

        if (this.tagsReady()) {
            console.info('All tags requested');

            // first: prioritize tags based on given rules.
            this._tags = prioritizeTags(this._tags);

            // then: initialize first tag
            this.loadNextTag();

            if (this.campaign.isStandard()) {
                this.$els.playmain.show();
            }
        }
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

    loadNextTag(byUser = false, forced = false) {
        // @note: not in view?
        if (!forced && this.mainTag && !this.mainTag.completed && this.mainTag.ima.initialized && this.mainTag.ima.loaded && !this.mainTag.ima.error) {
            return false;
        }

        // holds indexes of failed tags
        const remove = [];

        this._tags.some((tag, index) => {
            if (tag.ima.error || tag.ima.started || tag.ima.completed) {
                remove.push(index);

                return false;
            }

            // interrupt initialization if youtube is playing
            if (this._youtube && this._youtubeReady && this._youtube.wasPlayed()) {
                return true;
            }

            this.mainTag = tag;

            this.mainTag.ima.initialize(byUser);

            return true;
        });

        // remove failed tags
        remove.forEach((tagIndex) => {
            this._tags.splice(tagIndex, 1);
        });

        this.resetTags();
    }

    noTagsLeft() {
        return !this._tags.length;
    }

    continuousLoad() {
        if (this.campaign.isSidebarInfinity()) {
            return true;
        }

        if (this.campaign.isOnscroll()) {
            return true;
        }

        // @todo: add logic for standard

        return false;
    }

    resetTags() {
        if (this.continuousLoad() && this.noTagsLeft() && !this._disabled) {
            this._tagsRequested = 0;

            this.__setTags();
        }
    }

    disable() {
        this._disabled = true;

        return this;
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

        if (this.campaign.isStandard()) {
            this.$els.logo.show();
            this.$els.overlay.show();
        }

        if (this.__isSliding()) {
            this.$els.container.asSlided();
        }

        if (this.__isFading()) {
            this.$els.container.asFaded();
        }

        if (this.campaign.isSidebarInfinity()) {
            this.$el.addClass('sidebar');

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

    __setTags() {
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
