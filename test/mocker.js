'use strict';

var sep = require('path').sep;

var config = {
    cwd: [__dirname, 'mock-modules'].join(sep)
};

module.exports = require('./mocker/mockerFactory')(config);