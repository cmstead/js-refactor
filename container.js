'use strict';

var sep = require('path').sep;

var config = {
    cwd: __dirname + sep + 'modules',
    modulePaths: [
        '_jsr-new-core',
        '_jsr-new-core' + sep + 'extract-variable',
        '_jsr-new-core' + sep + 'const',

        'commands',
        'commands' + sep + 'generic',
        'helpers',
        'shared',
        'shared' + sep + 'ast-tools',
        'shared' + sep + 'refactoring-tools',
        'shared' + sep + 'selection-tools',
        'shared' + sep + 'loader-files',
        'shared' + sep + 'editor-tools',
        'wrapped-modules'
    ]
}

module.exports = require('dject').new(config);