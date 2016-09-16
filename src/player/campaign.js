import device from '../utils/device';

/**
 * Handles campaign information received from app.
 * Acts like a model.
 */
class Campaign {
    constructor(data) {
        this.data = data;
    }

    isStandard() {
        return this.data.info.type == 'standard';
    }

    isOnscroll() {
        return this.data.info.type == 'onscrolldisplay';
    }

    tags() {
        let tags;

        switch (this.data.info.type) {
            case 'standard':
                tags = this.data.tags.general;
                break;
            case 'onscrolldisplay':
                tags = this.data.tags.stream;
                break;
            default:
                console.warn('Unhandled campaign type', this.data.info.type);
                break;
        }

        return device.isMobile() ? tags.mobile : tags.desktop;
    }

    size() {
        if (this.isOnscroll()) {
            return {
                width: 640,
                height: 360
            }
        }

        return this._parseSize();
    }

    videos() {
        const videos = this.data.campaign.videos;

        if (this.isOnscroll()) {
            return false;
        }

        if (this.isStandard()) {
            return videos[0];
        }

        return videos;
    }

    _parseSize() {
        let parts;

        if (this.data.campaign.size == 'auto') {
            return false;
        }

        parts = this.data.campaign.size.split('x');

        return {
            width: parts[0],
            height: parts[1]
        }
    }
}

export default Campaign;
