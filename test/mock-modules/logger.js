'use strict';

var api = {}

function loggerFactory (api) {
    function log (){}

    api.log = log;

    return function logger () {
        return api;
    }
}

module.exports = loggerFactory;