'use strict';

function logger (vsCodeFactory) {
    var vscode = vsCodeFactory.get();
    
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

    function quickPick(items, options, callback) {
        vscode.window.showQuickPick(items, options).then(callback);
    }

    return {
        error: error,
        info: info,
        input: input,
        log: log,
        quickPick: quickPick
    };
}

module.exports = logger;