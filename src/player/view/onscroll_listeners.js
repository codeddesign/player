import device from '../../utils/device';

export default (player) => {
    /**
     * Events by user.
     */

    player.$els.aclose.sub('click', (ev, el) => {
        el.hide();

        player.mainTag.ima.manager.stop();
    })

    player.$els.asound.sub('click', (ev, el) => {
        ev.stopPropagation();

        const muted = el.hasClass('icon-mute') ? 1 : 0;

        el.pub('toggle:sound', { sound: muted ? true : false });

        if (!device.isIPhone()) {
            player.mainTag.ima.manager.setVolume(muted);
            return false
        }

        (muted) ? player.mainTag.ima.animator.unmute(): player.mainTag.ima.animator.mute();
    })

    player.$els.asound.sub('toggle:sound', (ev, el) => {
        if (ev.detail.sound) {
            el.addClass('icon-volume1')
            el.removeClass('icon-mute');

            return false
        }

        el.addClass('icon-mute')
        el.removeClass('icon-volume1');
    });

    // control sound on desktop for onscroll
    player.$el.sub('hovering:sound', (ev) => {
        if (device.isIPhone()) {
            return false;
        }

        player.mainTag.ima.manager.setVolume(ev.detail.volume);
    })

    player.$el.sub('mouseover', (ev, el) => {
        el.pub('hovering:sound', { volume: 1 });
    })

    player.$el.sub('mouseout', (ev, el) => {
        el.pub('hovering:sound', { volume: 0 });
    })

    /**
     * Other events.
     */

    player.$el.sub('canplay', () => {
        if (!player.mainTag.ima.started && player.$el.onScreen().mustPlay) {
            // it will trigger 'transitionend'
            player.$els.container.slideDown();

            return false;
        }
    })

    player.$els.container.sub('transitionend', () => {
        player.play();
    })

    player.$el.sub('started', () => {
        if (!player.mainTag.ima.isSkippable()) {
            player.$els.aclose.show();
        }

        if (device.isMobile()) {
            player.$els.asound.show();
        }
    })

    player.$el.sub('completed', () => {
        player.$els.container.slideUp();

        player.$els.aclose.hide();
    })

    player.$el.sub('aerror', () => {
        if (player.mainTag.loaded) {
            player.$el.pub('completed');
        }
    })
};
