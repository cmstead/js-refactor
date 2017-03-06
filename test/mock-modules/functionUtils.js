'use strict';

function functionUtilsFactory (api) {
    return function functionUtils() {
        return api;
    }
}

module.exports = functionUtilsFactory;