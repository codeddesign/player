import $ from '../../utils/element';

export default (player) => {
    /**
     * Current ad state.
     */

    let completed = false,
        hadError = false;

    /**
     * Events by user
     */

    $().sub('scroll', () => {
        if (player.$el.parent().bounds().top <= 0) {
            player.$el.addClass('fixed');

            return false;
        }

        player.$el.removeClass('fixed');

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

        // fake scroll
        if (!player.$el.onScreen().mustPlay) {
            $().pub('scroll');
        }

        // trigger the play
        player.$els.container.fadeIn();
    })

    player.$el.sub('loaded', () => {
        player.$els.filler.fadeOut();
    })

    player.$els.container.sub('transitionend', () => {
        if (completed) {
            player.$els.filler.fadeIn();
        }
    })

    player.$el.sub('completed', (ev) => {
        completed = true;
        player.$els.container.fadeOut();

        hadError = true;
        if (!ev.detail.error) {
            hadError = false;

            player.mainTag.ima._$el.remove();
        }
    })

    player.$el.sub('aerror', () => {
        player.$el.pub('completed', { error: true });

        player.$els.filler.pub('transitionend');
    })
};
