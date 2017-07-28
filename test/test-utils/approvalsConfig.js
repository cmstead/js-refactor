
var BeyondCompare4 = require('./BeyondCompare4Reporter');

module.exports = {
    reporters: ['kdiff3'],

    normalizeLineEndingsTo: '\n',

    appendEOL: true,

    EOL: require('os').EOL,

    errorOnStaleApprovedFiles: true,

    shouldIgnoreStaleApprovedFile: function (/*fileName*/) { return false; },

    stripBOM: false,

    forceApproveAll: false,

    failOnLineEndingDifferences: false

}