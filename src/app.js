import social from './social';
import assets from './assets';
import ajax from './utils/ajax';
import source from './source';
import Player from './player/player';
import config from '../config';
import track from './tracker';
import testAdjust from './utils/test_adjust_data';

assets().add(() => {
    if (config.sentry) Raven.config(config.sentry).install();

    try {
        ajax().campaign(source.id, (data, success, status) => {
            track.app(data.campaign.id, status);

            if (!success) {
                throw new Error(`Campaign ${source.id} does not exist.`);
            }

            data = testAdjust(data);

            new Player(data);
        });
    } catch (e) {
        if (config.sentry) Raven.captureException(e);
    }
});
