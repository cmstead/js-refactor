'use strict';

function arrayUtils(
    typeHelper
) {
    const first = values => values[0];
    const last = values => values[values.length - 1];

    return {
        first: typeHelper.enforce(
            'array => *',
            first),
        
        last: typeHelper.enforce(
            'array => *',
            last)
    }
}

module.exports = arrayUtils;