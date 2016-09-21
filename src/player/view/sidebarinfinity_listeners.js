import $ from '../../utils/element';

export default (player) => {
    /**
     * Current ad state.
     */

    let completed = false;

    /**
     * Events by user
     */

    $().sub('scroll', () => {
        if (player.$el.parent().bounds().top <= 0) {
            player.$el.addClass('fixed');

            return false;
        }

        player.$el.removeClass('fixed');

        if (player.$el.onScreen().mustPlay && player.mainTag && player.mainTag.ima.loaded && !player.mainTag.ima.started) {
            player.$els.filler.fadeOut();
        }

        return false;
    })

    player.$els.aclose.sub('click', () => {
        player.$el.pub('disable');
    })

    /**
     * Other events.
     */

    player.$el.sub('disable', () => {
        player.disable();

        player.$el.hide();
    })

    player.$el.sub('skipped', () => {
        player.$el.pub('disable');
    })

    player.$els.filler.sub('transitionend', () => {
        if (completed) {
            completed = false;

            player.loadNextTag(false, true);

            return false;
        }

        // triggers play
        if (player.$el.onScreen().mustPlay) {
            player.$els.container.fadeIn();
        }
    })

    player.$el.sub('loaded', () => {
        if (player.$el.onScreen().mustPlay) {
            player.$els.filler.fadeOut();
        }
    })

    player.$els.container.sub('transitionend', () => {
        if (completed) {
            player.$els.filler.fadeIn();
        }
    })

    player.$el.sub('completed', (ev) => {
        completed = true;
        player.$els.container.fadeOut();

        if (!ev.detail.error) {
            player.mainTag.ima.destroy();
        }
    })

    player.$el.sub('aerror', () => {
        player.$el.pub('completed', { error: true });

        player.$els.filler.pub('transitionend');
    })
};
