var vscodeFactory = require('./modules/shared/vscodeFactory');

var addExport = require('./modules/commands/add-export');
var convertToMemberFunction = require('./modules/commands/convert-to-member-function');
var convertToNamedFunction = require('./modules/commands/convert-to-named-function');
var extractVariable = require('./modules/commands/extract-variable');
var shiftParamsLeft = require('./modules/commands/shift-params-left');
var shiftParamsRight = require('./modules/commands/shift-params-right');
var wrapInExecutedFunction = require('./modules/commands/wrap-in-executed-function')
var wrapInFunction = require('./modules/commands/wrap-in-function')
var wrapInIIFE = require('./modules/commands/wrap-in-iife')
var wrapInCondition = require('./modules/commands/wrap-in-condition')

function activate(context) {
	var vscode = vscodeFactory.get();

	function formatSelection() {
		vscode.commands.executeCommand("editor.action.formatSelection");
	}

	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.convertToMemberFunction', function () {
		convertToMemberFunction(vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.convertToNamedFunction', function () {
		convertToNamedFunction(vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.wrapInExecutedFunction', function () {
		wrapInExecutedFunction(vscode.window.activeTextEditor, formatSelection);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.wrapInFunction', function () {
		wrapInFunction(vscode.window.activeTextEditor, formatSelection);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.wrapInIIFE', function () {
		wrapInIIFE(vscode.window.activeTextEditor, formatSelection);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.wrapInCondition', function () {
		wrapInCondition(vscode.window.activeTextEditor, formatSelection);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.exportFunction', function () {
		addExport(vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.extractVariable', function () {
		extractVariable(vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.shiftParamsLeft', function () {
		shiftParamsLeft(vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('cmstead.jsRefactor.shiftParamsRight', function () {
		shiftParamsRight(vscode.window.activeTextEditor);
	}));

}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;