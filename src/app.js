import social from './social';
import assets from './assets';
import ajax from './utils/ajax';
import source from './source';
import Player from './player/player';

assets().add(() => {
    ajax().campaign(source.id, (data, success, status) => {
        if (!success) {
            throw new Error(`Campaign ${source.id} does not exist.`);
        }

        window.player = new Player(data);
    });
});
