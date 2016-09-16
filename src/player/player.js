import Campaign from './campaign';
import Tag from './tag';
import youtube from './google/youtube';
import createTemplate from './view/create_template';
import addGeneralListeners from './view/general_listeners';
import addStandardListeners from './view/standard_listeners';
import addOnscrollListeners from './view/onscroll_listeners';
import prioritizeTags from '../utils/prioritize_tags';
import device from '../utils/device';

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

        this.__setTemplateElements()
            .__setTemplateListeners()
            .__setView()
            .__setTags()
            .__setYoutube();
    }

    play() {
        if (this.mainTag.ima.loaded) {
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

            // then: set first one as main
            this.setMainTag();

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
            return {
                width: this.$el.node.offsetWidth,
                height: this.$el.node.offsetHeight
            }
        }

        if (!this.campaign.size()) {
            throw Error('Failed to determine size');
        }

        return this.campaign.size();
    }

    setMainTag(index = 0) {
        if (this._tags.length) {
            this.mainTag = this._tags[index];

            this.mainTag.ima.initialize();
        }

        return this;
    }

    loadNextTag(byUser = false) {
        // not in view also.
        if (this.mainTag && this.mainTag.ima.initialized && this.mainTag.ima.loaded && !this.mainTag.ima.error) {
            return false;
        }

        // holds indexes of failed tags
        const remove = [];

        this._tags.some((tag, index) => {
            if (tag.ima.error) {
                remove.push(index);

                return false;
            }

            // interrupt initialization if youtube is playing
            if (this._youtube && this._youtube.isPlaying()) {
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

        if (this.campaign.isOnscroll()) {
            addOnscrollListeners(this);
        }

        return this;
    }

    __setView(campaign) {
        if (device.isMobile()) {
            this.$els.container.addClass('mobile');

            if (device.isIGadget()) {
                this.$els.container.addClass('iDevice');
            }
        }

        if (this.campaign.isStandard() || 1 == 1) {
            this.$el.show();
            this.$els.container.show();
        }

        if (this.campaign.isOnscroll()) {
            this.$els.logo.hide();
            this.$els.overlay.hide();

            this.$els.container.addClass('onscroll');
        }

        return this;
    }

    __setTags() {
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
}

export default (data) => {
    return new Player(data);
};
