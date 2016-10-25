import $ from '../../utils/element';
import device from '../../utils/device';

export default (player) => {
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
