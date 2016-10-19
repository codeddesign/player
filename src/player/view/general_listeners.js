import $ from '../../utils/element';
import device from '../../utils/device';

export default (player) => {
    /**
     * Helpers
     */
    const play = () => {
        if (!player.mainTag.ima.loaded) {
            return false;
        }

        if (!player.mainTag.ima.started && player.$el.onScreen().mustPlay) {
            player.$els.container.slideDown();

            return false;
        }

        if (!player.mainTag.ima.completed && player.$el.onScreen().mustPlay) {
            /**
             * Standard campaign on iphone guess full screen
             * and when minimized it pauses so we avoid resuming
             */

            if (player.campaign.isStandard() && device.isIPhone()) {
                return false;
            }

            player.mainTag.ima.manager.resume();

            return false;
        }
    }

    const pause = () => {
        if (!player.mainTag.ima.completed && player.$el.onScreen().mustPause) {
            player.mainTag.ima.manager.pause();

            return false;
        }
    }

    /**
     * Events by user.
     */

    $().sub('scroll', () => {
        if (!player.mainTag || !player.mainTag.ima.loaded) {
            player.$el.pub('fill-ld');

            return false;
        }

        play();

        pause();
    })

    /**
     * Other events.
     */

    player.$el.sub('loaded', () => {
        player.$els.loading.hide();

        // on desktop loaded means it can play
        if (!device.isMobile()) {
            player.$el.pub('canplay');
        }
    })

    player.$el.sub('initialized', () => {
        player.$els.loading.show();
    })

    player.$el.sub('completed', () => {
        player.playing = false;

        player.$els.loading.hide();

        player.youtubePlay();
    })

    player.$el.sub('skipped', () => {
        player.playing = false;
    })

    player.$el.sub('aerror', () => {
        player.playing = false;

        player.$els.loading.hide();
    })
}
