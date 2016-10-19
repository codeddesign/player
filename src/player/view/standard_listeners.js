import device from '../../utils/device';
import toMinutesStr from '../../utils/to_minutes_str';

export default (player) => {
    /**
     * Helpers
     */
    const youtubeNotPlaying = () => {
        return !player._youtubeReady || !player._youtube.isPlaying();
    }

    const youtubeIsPlaying = () => {
        return !player._youtubeReady || player._youtube.isPlaying();
    }

    const progressCursor = (ev, el) => {
        return ev.layerX * el.max / el.offsetWidth;
    }

    const setSeconds = (seconds) => {
        player.$els.progress.attr('value', seconds);
        player.$els.timelive.html(toMinutesStr(seconds));
    }

    const setButtonToPause = () => {
        player.$els.play.addClass('icon-pause');
        player.$els.play.removeClass('icon-play');
    }

    const setButtonToPlay = () => {
        player.$els.play.addClass('icon-play');
        player.$els.play.removeClass('icon-pause');
    }

    let expectsToPlay = false;

    /**
     * User - events
     */
    player.$els.overlay.sub('click', (ev, el) => {
        if (youtubeIsPlaying()) {
            return false;
        }

        if (!player.tagsReady()) {
            return false;
        }

        expectsToPlay = true;

        el.hide();

        player.$els.logo.hide();
        player.$els.overlay.hide();

        player.play();
    })

    player.$els.play.sub('click', () => {
        if (player._youtube.isPlaying()) {
            player._youtube.pauseVideo();
            return false;
        }

        player._youtube.play();
    })

    player.$els.progress.sub('click', (ev, el) => {
        ev.preventDefault();
        ev.stopPropagation();

        player.$el.pub('yt:jump', { seconds: progressCursor(ev, el.node) });
    })

    // video controls - hovering
    player.$els.container.sub('hovering', (ev) => {
        player.$hovering.forEach(function(el) {
            if (el.hasClass('hidden') || ev.detail.action == 'show') {
                el.removeClass('hidden');
                return false;
            }

            el.addClass('hidden');
        });
    })

    player.$els.container.sub('hovering:show', (ev, el) => {
        el.pub('hovering', { action: 'show' });
    });

    player.$els.container.sub('hovering:hide', (ev, el) => {
        el.pub('hovering', { action: 'hide' });
    });

    player.$els.container.sub('mouseover', (ev, el) => {
        if (youtubeNotPlaying()) {
            return false;
        }

        el.pub('hovering:show');
    })

    player.$els.container.sub('mouseout', (ev, el) => {
        if (youtubeNotPlaying()) {
            return false;
        }

        el.pub('hovering:hide');
    })

    // sharing - code
    player.$els.share.find('.icon-vidshareurl').sub('click', () => {
        player._youtube.pauseVideo();

        player.$els.code.show();
    })

    player.$els.code.find('.close').sub('click', (ev) => {
        player.$els.code.hide();

        player._youtube.resume();
    })

    player.$els.code.find('textarea').sub('click', (ev, el) => {
        el.select();
    })

    // sharing - facebook
    player.$els.share.find('.icon-vidfacebook').sub('click', () => {
        player._youtube.pauseVideo();

        FB.ui({
            method: 'share',
            mobile_iframe: true,
            href: location.href,
        }, function(response) {
            player._youtube.resume();
        });
    })

    // sharing - twitter
    player.$els.share.find('.icon-vidtwitter').sub('click', () => {
        player._youtube.pauseVideo();

        window.open(
            'https://twitter.com/share?url=' + escape(location.href) + '&text=Watch this!',
            '',
            'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
        );
    })

    /**
     * Youtube - events
     */
    player.$el.sub('yt:ready', () => {
        player.onYoutubeReady();

        // update selector
        player.$els.youtube = player.$el.find('iframe.player__youtube')

        // run interval for time update
        setInterval(() => {
            player.$el.pub('yt:timeupdate');
        }, 1000);

        // set data
        const totalSeconds = player._youtube.getDuration() - 1;

        player.$els.progress.attr('max', totalSeconds);
        player.$els.timetotal.html(toMinutesStr(totalSeconds));
        player.$els.timelive.html(toMinutesStr(0));

        // @backup: hide loading
        player.$els.loading.hide();
    })

    /**
     * Youtube starts only if there's no ad loaded
     * when play it's being triggered (click).
     *
     * This event acts like a fallback in case youtube starts
     * playing and the ad was loading meanwhile.
     */

    player.$el.sub('a:destroy', () => {
        if (player.mainTag) {
            player.mainTag.ima.destroy();

            // @backup: hide loading
            player.$els.loading.hide();
        }
    })

    player.$el.sub('yt:timeupdate', () => {
        if (youtubeNotPlaying()) {
            return false;
        }

        setSeconds(player._youtube.getCurrentTime());

        player.$el.pub('a:destroy');
    })

    player.$el.sub('yt:jump', (ev) => {
        player._youtube.seekTo(ev.detail.seconds);

        setSeconds(ev.detail.seconds);
    })

    player.$el.sub('yt:playing', () => {
        player.$els.container.pub('hovering:show');

        player.$els.logo.hide();
        player.$els.overlay.hide();
        player.$els.loading.hide();

        player.$els.youtube.show();

        setButtonToPause();
    })

    player.$el.sub('yt:paused', () => {
        player.$els.container.pub('hovering:show');

        setButtonToPlay();
    })

    player.$el.sub('yt:ended', () => {
        player.$els.container.pub('hovering:show');

        setButtonToPlay()
    })

    /**
     * Other events.
     */
    player.$el.sub('aerror', () => {
        if (!player.tagsLeft()) {
            player.$els.container.addClass('aderror');

            player.$els.youtube.show();
        }

        if (expectsToPlay) {
            player.disable();

            player.play();
        }
    })

    player.$el.sub('canplay', () => {
        if (expectsToPlay) {
            player.disable();

            player.play();
        }
    })

    player.$el.sub('started', () => {
        player.disable();
    })

    player.$el.sub('skipped', () => {
        player.disable();

        player.play();
    })
};
