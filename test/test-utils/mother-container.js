'use strict';

const fs = require('fs');
const motherContainer = require('datamother')();

const motherFileDir = __dirname + '/../mother-files';

const motherFiles = fs
    .readdirSync(motherFileDir)
    .filter((filename) => filename !== '.' && filename !== '..');

motherFiles.forEach(function (filename) {
    const filePath = motherFileDir + '/' + filename;
    require(filePath)(motherContainer);
});

module.exports = motherContainer;