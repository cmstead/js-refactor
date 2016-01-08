'use strict';

var vscode = require('vscode');

function log (message) {
    vscode.window.showInformationMessage(message);
}

function loggerFactory () {
    return {
        log: log
    };
}

module.exports = loggerFactory;