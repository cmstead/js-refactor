'use strict';

var mockery = require('mockery');

function setup(mocks) {
    mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false
    });

    Object.keys(mocks).forEach(function (key) {
        mockery.registerMock(key, mocks[key]);
    });
}

function teardown() {
    mockery.deregisterAll();
    mockery.disable();
}

module.exports = {
    setup: setup,
    teardown: teardown
};