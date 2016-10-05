import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

/**
 * Plugins list.
 */

const plugins = [
    replace({
        ENVIRONMENT: JSON.stringify(process.env.build)
    }),
    buble(),
    uglify() // must to be last
];

/**
 * Adjustments based on build.
 */

let playerName = 'player';

switch (process.env.build) {
    case 'dev':
        // remove uglify
        plugins.pop();

        break;
    case 'debug':
        // change player destination name
        playerName = 'player-debug';

        break;
}

export default {
    entry: 'src/app.js',
    dest: 'dist/' + playerName + '.js',
    format: 'iife',
    plugins: plugins
}
