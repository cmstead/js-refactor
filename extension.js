var vscode = require('vscode');
var logger = require('./modules/logger-factory')();
var extractToFunction = require('./modules/commands/extract-to-function')
var wrapInFunction = require('./modules/commands/wrap-in-function')
var wrapInIIFE = require('./modules/commands/wrap-in-iife')

function activate(context) {

	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.extractToFunction', function () {
        extractToFunction(vscode.window.activeTextEditor);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.wrapInFunction', function () {
        wrapInFunction(vscode.window.activeTextEditor);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.wrapInIIFE', function () {
        wrapInIIFE(vscode.window.activeTextEditor);
	}));
	
}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;