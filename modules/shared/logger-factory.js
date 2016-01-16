'use strict';

var vscode = require('vscode');

function log (message) {
    vscode.window.showInformationMessage(message);
}

function error (message) {
    vscode.window.showErrorMessage(message);
}

function info (message) {
    vscode.window.showInformationMessage(message);
}

function input (options, callback) {
    vscode.window.showInputBox(options).then(callback);
}

function loggerFactory () {
    return {
        error: error,
        info: info,
        input: input,
        log: log
    };
}

module.exports = loggerFactory;