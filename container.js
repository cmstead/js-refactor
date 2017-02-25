'use strict';

var sep = require('path').sep;

var config = {
    cwd: __dirname + sep + 'modules',
    modulePaths: [
        'commands',
        'refactoring-logic',
        'shared'
    ]
}

module.exports = require('dject').new(config);