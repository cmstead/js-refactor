'use strict';

function utilitiesFactory (api) {
    return function utilities() {
        return api;
    }
}

module.exports = utilitiesFactory;