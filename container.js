'use strict';

var sep = require('path').sep;

var config = {
    cwd: __dirname + sep + 'modules',
    modulePaths: [
        'commands',
        'commands' + sep + 'generic',
        'helpers',
        'shared',
        'shared' + sep + 'ast-tools',
        'shared' + sep + 'refactoring-tools',
        'shared' + sep + 'selection-tools',
        'shared' + sep + 'loader-files',
    ]
}

module.exports = require('dject').new(config);