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
	var activeEditor = vscode.window.activeTextEditor;

	var commands = [
		{
			name: 'cmstead.jsRefactor.convertToMemberFunction',
			behavior: convertToMemberFunction(activeEditor, formatSelection)
		},
		{
			name: 'cmstead.jsRefactor.convertToNamedFunction',
			behavior: convertToNamedFunction(activeEditor, formatSelection)
		},
		{
			name: 'cmstead.jsRefactor.wrapInExecutedFunction',
			behavior: wrapInExecutedFunction(activeEditor, formatSelection)
		},
		{
			name: 'cmstead.jsRefactor.wrapInFunction',
			behavior: wrapInFunction(activeEditor, formatSelection)
		},
		{
			name: 'cmstead.jsRefactor.wrapInIIFE',
			behavior: wrapInIIFE(activeEditor, formatSelection)
		},
		{
			name: 'cmstead.jsRefactor.wrapInCondition',
			behavior: wrapInCondition(activeEditor, formatSelection)
		},
		{
			name: 'cmstead.jsRefactor.exportFunction',
			behavior: addExport(activeEditor, formatSelection)
		},
		{
			name: 'cmstead.jsRefactor.extractVariable',
			behavior: extractVariable(activeEditor, formatSelection)
		},
		{
			name: 'cmstead.jsRefactor.shiftParamsLeft',
			behavior: shiftParamsLeft(activeEditor, formatSelection)
		},
		{
			name: 'cmstead.jsRefactor.shiftParamsRight',
			behavior: shiftParamsRight(activeEditor, formatSelection)
		}
	];

	commands.forEach(registerCommand);

	function formatSelection() {
		vscode.commands.executeCommand("editor.action.formatSelection");
	}

	function registerCommand(command) {
		context.subscriptions.push(vscode.commands.registerCommand(command.name, command.behavior));
	}
}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;