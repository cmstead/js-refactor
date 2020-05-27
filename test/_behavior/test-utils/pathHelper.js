const path = require('path');

function buildPath(...pathParts) {
    return path.join.apply(path, pathParts);
}

module.exports = {
    buildPath
};