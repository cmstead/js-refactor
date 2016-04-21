'use strict';

function approvalsSetup() {
    var defaultConfig = {
        reporters: [
            "beyondCompare"
        ]
    };

    require('approvals').mocha('./test/approvals');
}

module.exports = approvalsSetup;