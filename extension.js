var vscode = require('vscode');

var convertToMemberFunction = require('./modules/commands/convert-to-member-function');
var convertToNamedFunction = require('./modules/commands/convert-to-named-function');
var wrapInExecutedFunction = require('./modules/commands/wrap-in-executed-function')
var wrapInFunction = require('./modules/commands/wrap-in-function')
var wrapInIIFE = require('./modules/commands/wrap-in-iife')
var wrapInCondition = require('./modules/commands/wrap-in-condition')

function activate(context) {

	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.convertToMemberFunction', function () {
        convertToMemberFunction(vscode.window.activeTextEditor);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.convertToNamedFunction', function () {
        convertToNamedFunction(vscode.window.activeTextEditor);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.wrapInExecutedFunction', function () {
        wrapInExecutedFunction(vscode.window.activeTextEditor);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.wrapInFunction', function () {
        wrapInFunction(vscode.window.activeTextEditor);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.wrapInIIFE', function () {
        wrapInIIFE(vscode.window.activeTextEditor);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.wrapInCondition', function () {
        wrapInCondition(vscode.window.activeTextEditor);
	}));
	
}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;