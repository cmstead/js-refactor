'use strict';

var sep = require('path').sep;

var config = {
    cwd: __dirname + sep + 'modules',
    modulePaths: [
        '_jsr-new-core' + sep + '**' + sep + '*.js',

        'commands',
        'commands' + sep + 'generic',
        'helpers',
        'shared' + sep + '**' + sep + '*.js',
        'wrapped-modules'
    ]
}

module.exports = require('dject').new(config);