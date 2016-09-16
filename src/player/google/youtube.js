class Youtube {
    constructor(player, videoId) {
        let self = this;

        this._status = false;
        this._muted = false;
        this._isFullscreen = false;

        this._yt = new YT.Player(player.$els.youtube.node, {
            videoId: videoId,
            playerVars: {
                enablejsapi: 1,
                disablekb: 1,
                controls: 0,
                showinfo: 0,
                modestbranding: 1,
                rel: 0,
                autoplay: 0,
                iv_load_policy: 3,
                fs: 0 // no full screen
            },
            events: {
                onReady() {
                    // add helper methods
                    self._yt.hasEnded = () => {
                        return self._status == 0;
                    }

                    self._yt.isPlaying = () => {
                        return self._status == 1;
                    }

                    self._yt.isPaused = () => {
                        return self._status == 2;
                    }

                    self._yt.play = () => {
                        if (player.campaign.isStandard()) {
                            self._yt.playVideo();
                        }
                    }

                    self._yt.resume = () => {
                        if (!self._yt.hasEnded()) {
                            self._yt.playVideo();
                        }
                    }

                    player.$el.pub('yt:ready');
                },
                onStateChange(ev) {
                    const mapped = {
                        0: 'ended',
                        1: 'playing',
                        2: 'paused',
                        3: 'loading'
                    }

                    self._status = ev.data;

                    player.$el.pub(`yt:${mapped[ev.data]}`);
                }
            }
        });
    }
}

export default (player, videoId) => {
    return new Youtube(player, videoId)._yt;
};
