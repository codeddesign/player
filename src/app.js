import social from './social';
import assets from './assets';
import ajax from './utils/ajax';
import source from './source';
import Player from './player/player';
import config from '../config';
import track from './tracker';
import testAdjust from './utils/test_adjust_data';

assets().add(() => {
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
        if (config.sentry && Raven) {
            Raven.config(config.sentry).install();
            Raven.captureException(e);
        }
    }
});
