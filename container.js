'use strict';

var sep = require('path').sep;

var config = {
    cwd: __dirname + sep + 'modules',
    modulePaths: [
        // This line represents the new solution development
        '_jsr-new-core' + sep + '**' + sep + '*.js',

        'commands' + sep + '**' + sep + '*.js',
        'shared' + sep + '**' + sep + '*.js',

        'helpers',
        'wrapped-modules'
    ]
}

module.exports = require('dject').new(config);