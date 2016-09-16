/**
 * Determine device browser.
 */
class Device {
    constructor() {
        this.agent = navigator.userAgent;

        this.platform = navigator.platform;
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.agent);
    }

    isIGadget() {
        return /webOS|iPhone|iPad|iPod/i.test(this.agent)
    }

    isIPhone() {
        const agent = /iPhone|iPod/i.test(this.agent),
            platform = /iPhone|iPod/i.test(this.platform);

        return agent && platform;
    }
}

export default (() => {
    return new Device();
})();
