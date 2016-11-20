import config from '../../../config';
import device from '../../utils/device';
import $ from '../../utils/element';
import random from '../../utils/random';

export default (player) => {
    /**
     * Helpers.
     */

    const play = () => {
        if (!player.mainTag.ima.loaded) {
            return false;
        }

        if (!player.mainTag.ima.destroyed && !player.mainTag.ima.started && player.$el.onScreen().mustPlay) {
            if (player.campaign.isOnscroll()) {
                // start slide
                player.$els.container.slideDown();

                // play it too
                player.play();
            }

            return false;
        }
    }

    const slideUp = () => {
        player.$els.container.slideUp();

        player.$els.aclose.hide();
    }

    /**
     * Events by user.
     */

    $().sub('scroll', () => {
        if (!player.mainTag || !player.mainTag.ima.loaded || player.mainTag.ima.error) {
            player.$el.pub('fill-ld');

            return false;
        }

        play();
    })

    player.$els.aclose.sub('click', (ev, el) => {
        player.$el.pub('skipped');

        // stop manager (note: using ima.destroy() won't trigger slideUp)
        player.mainTag.ima.manager.stop();

        // hide: close icon
        el.hide();

        // hide: sound icon
        player.$els.asound.hide();
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

        if (!player.mainTag || !player.mainTag.ima) {
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

    // @test: black-ad
    let scrolled = false;

    player.$el.sub('canplay', () => {
        if (!player.mainTag.ima.started) {
            $().pub('scroll');
        }
    })

    player.$el.sub('started', () => {
        // @test: black-ad
        if (!scrolled) {
            scrolled = true;

            window.scrollBy(0, 1);
            setTimeout(() => {
                window.scrollBy(0, -1);
            }, 100);
        }

        // @backup: show ad
        player.mainTag.ima._$el.show();

        // reset: sound icon
        player.$els.asound.pub('toggle:sound', { detail: { volume: 0 } });

        // reset: close icon
        player.$els.aclose.hide();

        // delay: showing close icon
        if (!player.mainTag.ima.isSkippable()) {
            setTimeout(() => {
                player.$els.aclose.show();
            }, config.delays.aclose * 1000);
        }

        // show sound icon on mobile
        if (device.isMobile()) {
            player.$els.asound.show();
        }
    })

    player.$el.sub('completed', () => {
        // @test: black-ad
        scrolled = false;
    })

    player.$el.sub('completed', () => {
        if (!player.campaign.isOnscroll()) {
            return false;
        }

        // request again
        player.mainTag.request(true);

        // play next one
        if (player.tagsLeft()) {
            player.play();

            return false;
        }

        slideUp();
    })

    player.$el.sub('aerror', (ev) => {
        const tag = ev.detail.tag;

        // request again
        tag.request(true);

        if (tag.ima.loaded && !player.tagsLeft()) {
            slideUp();

            return false;
        }

        player.play();
    })

    player.$el.sub('loaded', (ev) => {
        // stop requests
        if (player.campaign.isOnscroll()) {
            player.stopRequests();
        }
    })

    player.$el.sub('skipped', (ev) => {
        // @test: play next ad if current one gets skipped
        if (player.tagsLeft()) {
            player.play();

            return false;
        }

        slideUp();
    })

    let filled = false;
    player.$el.sub('fill-ld', () => {
        if (
            filled ||
            !player.campaign.isOnscroll() ||
            !player.$el.onScreen().mustPlay ||
            (player.mainTag && player.mainTag.ima.loaded && player.mainTag.ima.started && !player.mainTag.ima.error)
        ) {
            return false;
        }

        filled = true;

        player.disable();

        // generate ad unique element id
        const id = `ld-${random()}`;

        // filler: empty it, add id
        player.$els.filler.html('').attr('id', id);

        // push ad
        window.ldAdInit = window.ldAdInit || [];
        window.ldAdInit.push({ slot: config.lockerdome_slot, size: [0, 0], id: id });

        // show
        player.$els.filler.show();
    })
};
