var vscode = require('vscode');
var logger = require('./modules/logger-factory')();
var wrapInFunction = require('./modules/commands/wrap-in-function')
var wrapInIIFE = require('./modules/commands/wrap-in-iife')

function activate(context) {

	context.subscriptions.push(vscode.commands.registerCommand('jsRefactor.wrapInFunction', function () {
        wrapInFunction(vscode.window.activeTextEditor);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand('jsRefactor.wrapInIIFE', function () {
        wrapInIIFE(vscode.window.activeTextEditor);
	}));
	
}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;