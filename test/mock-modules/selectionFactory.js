'use strict';

function selectionFactory (api) {
    return function selectionFactory() {
        return function () {
            return api;
        };
    }
}

module.exports = selectionFactory;