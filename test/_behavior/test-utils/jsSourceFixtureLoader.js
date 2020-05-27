const fs = require('fs');
const { buildPath } = require('./pathHelper');

function load(basePath, filePath) {
    const readPath = buildPath(basePath, filePath);

    return fs.readFileSync(readPath, { encoding: 'utf8' });
}

function loadLines(basePath, filePath) {
    return load(basePath, filePath).split('\n');
}

module.exports = {
    buildPath,
    load,
    loadLines
}