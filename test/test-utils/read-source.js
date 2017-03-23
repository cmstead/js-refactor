'use strict';

var fs = require('fs');

function readSource (path){
    var fileSource = fs.readFileSync(path, { encoding: 'utf8' });
    return fileSource.split(/\r?\n/);
}

module.exports = readSource;