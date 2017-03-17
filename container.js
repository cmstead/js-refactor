'use strict';

var sep = require('path').sep;

var config = {
    cwd: __dirname + sep + 'modules',
    modulePaths: [
        'commands',
        'commands' + sep + 'generic',
        'helpers',
        'refactoring-logic',
        'refactoring-logic' + sep + 'generic',
        'shared'
    ]
}

module.exports = require('dject').new(config);