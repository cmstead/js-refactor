const espree = require('espree');
const fs = require('fs');
const path = require('path');

const parserOptions = {
    loc: true,
    ecmaVersion: 10,
    sourceType: 'module'
};

function load (basePath, filePath) {
    const fixturePath = path.join(basePath, filePath);
    const fileContent = fs.readFileSync(fixturePath, { encoding: 'utf8' });

    return espree.parse(fileContent, parserOptions);
}

function buildPath(...pathParts) {
    return path.join.apply(path, pathParts);
}

module.exports = {
    buildPath,
    load
};