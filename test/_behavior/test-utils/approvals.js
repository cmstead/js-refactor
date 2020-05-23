const approvalsConfig = {
    reporters: ['kdiff3'],

    normalizeLineEndingsTo: '\n',

    appendEOL: true,

    EOL: require('os').EOL,

    errorOnStaleApprovedFiles: false,

    shouldIgnoreStaleApprovedFile: function (/*fileName*/) { return false; },

    stripBOM: false,

    forceApproveAll: false,

    failOnLineEndingDifferences: true

}

const approvals = require('approvals');

module.exports = {
    init: () => approvals.configure(approvalsConfig).mocha('./test/approvals')
};
