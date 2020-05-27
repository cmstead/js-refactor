const espree = require('espree');
const fs = require('fs');
const { buildPath } = require('./pathHelper');

const parserOptions = {
    loc: true,
    ecmaVersion: 10,
    sourceType: 'module'
};

function load (basePath, filePath) {
    const fixturePath = buildPath(basePath, filePath);
    const fileContent = fs.readFileSync(fixturePath, { encoding: 'utf8' });

    return espree.parse(fileContent, parserOptions);
}

module.exports = {
    buildPath,
    load
};