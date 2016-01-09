'use strict';

var vscode = require('vscode');

function log (message) {
    vscode.window.showInformationMessage(message);
}

function error (message) {
    vscode.window.showErrorMessage(message);
}

function loggerFactory () {
    return {
        error: error,
        log: log
    };
}

module.exports = loggerFactory;