import config from '../../config';

/**
 * Sort tags by priority.
 *
 * Priority is given as an object where the
 * key is the string that needs to be found
 * and the value is a number.
 *
 * @param {Array} tags
 * @param {Object} priorities
 *
 * @return {Array}
 */
export default (tags, priorities) => {
    priorities = priorities || config.priority_rules;

    const keys = Object.keys(priorities),
        values = keys.map((key) => {
            return priorities[key]
        }).sort(),
        last = values[values.length - 1];

    let allocated = [],
        prioritized = [],
        index;

    tags.forEach((tag) => {
        index = false;
        keys.some((key) => {
            if (tag.contains(key)) {
                index = priorities[key];

                return true;
            }

            return false;
        });

        if (index === false) {
            index = last;
        }

        if (!allocated[index]) {
            allocated[index] = [];
        }

        allocated[index].push(tag);
    });

    allocated.forEach((tags) => {
        prioritized.push(...tags);
    });

    return prioritized;
}
