import $ from '../../utils/element';

export default (player) => {
    /**
     * Helpers.
     */
    let completed = false,
        shouldPlay = false;

    const filler = {
        out() {
            player.$els.filler.fadeOut();
        },
        in () {
            player.$els.filler.fadeIn();
        }
    };

    const container = {
        out() {
            player.$els.container.fadeOut();
        },
        in () {
            player.$els.container.fadeIn();
        }
    }

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
     * Player events.
     */

    player.$el.sub('disable', () => {
        player.disable();

        player.$el.hide();
    })

    player.$el.sub('skipped', () => {
        player.$el.pub('disable');
    })

    player.$el.sub('loaded', () => {
        if (!player.playing && !shouldPlay) {
            shouldPlay = true;

            filler.out();
        }
    })

    player.$el.sub('completed', () => {
        completed = true;

        player.playing = false;

        if (!player.isDisabled()) {
            // request again
            player.mainTag.request(true);

            // play next one
            if (completed && player.hasTagsLeft()) {
                player.play();

                return false;
            }
        }

        container.out();
    })

    /**
     * Other events
     */

    player.$els.filler.sub('transitionend', () => {
        if (!player.playing && shouldPlay) {
            container.in();

            return false;
        }
    })

    player.$els.container.sub('transitionend', () => {
        if (!player.playing) {
            if (shouldPlay) {
                shouldPlay = false;

                player.play();

                return false;
            }

            if (completed) {
                completed = false;

                filler.in();

                return false;
            }
        }
    })
};
