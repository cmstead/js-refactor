'use strict';

var sep = require('path').sep;

function mockerFactory (config){
    var mocks = {};

    function registerMock (filePath) {
        var fullPath = [config.cwd, filePath].join(sep);
        var api = {};

        var mock = require(fullPath)(api);
        var mockModule = {
            api: api,
            mock: mock
        };

        mocks[filePath] = mockModule;

        return mockModule;
    }

    function getMock (filePath) {
        return mocks[filePath];
    }

    return {
        registerMock: registerMock,
        getMock: getMock
    };
}

module.exports = mockerFactory;