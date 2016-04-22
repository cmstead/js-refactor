'use strict';

var vscodeFactory = require('./vscodeFactory');

module.exports = function () {
    var vscode = vscodeFactory.get();
    
    function log(message) {
        vscode.window.showInformationMessage(message);
    }

    function error(message) {
        vscode.window.showErrorMessage(message);
    }

    function info(message) {
        vscode.window.showInformationMessage(message);
    }

    function input(options, callback) {
        vscode.window.showInputBox(options).then(callback);
    }

    return {
        error: error,
        info: info,
        input: input,
        log: log
    };
}