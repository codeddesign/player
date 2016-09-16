import config from '../../config';

/**
 * Make ajax requests.
 */
class Ajax {
    constructor() {
        const versions = [
            'MSXML2.XmlHttp.5.0',
            'MSXML2.XmlHttp.4.0',
            'MSXML2.XmlHttp.3.0',
            'MSXML2.XmlHttp.2.0',
            'Microsoft.XmlHttp'
        ];

        this.xhr = false;

        if (typeof XMLHttpRequest !== 'undefined') {
            this.xhr = new XMLHttpRequest();

            return;
        }

        versions.some((version) => {
            try {
                this.xhr = new ActiveXObject(version);

                return true;
            } catch (e) {
                return false;
            }
        });
    }

    get(url, callback = () => {}) {
        this.xhr.onreadystatechange = () => {
            if (this.xhr.readyState === 4) {
                let data = this.xhr.responseText;
                try {
                    data = JSON.parse(this.xhr.responseText);
                } catch (e) {
                    console.warn('Failed to parse JSON');
                }

                callback(data, this.xhr.status == 200, this.xhr.status);
            }
        };

        this.xhr.open('GET', url, true);
        this.xhr.send();
    }

    campaign(id, callback) {
        this.get(config.app_path + '/campaign/' + id, callback);
    }
}

export default () => {
    return new Ajax;
}
