'use strict';

function approvalsSetup() {
    var defaultConfig = {
        reporters: ["BeyondCompare"],
        normalizeLineEndingsTo: '\n',
        appendEOL: true,
        stripBOM: true
    };

    require('approvals').mocha('./test/approvals');
}

module.exports = approvalsSetup;