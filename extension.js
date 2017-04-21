var container = require('./container');
var fs = require('fs');

function activate(context) {
	var vscode = container.build('vsCodeFactory').get();

	var formatDocument = vscode.commands.executeCommand.bind(vscode.commands, "editor.action.formatDocument");

	container.build('commandDefFactory').forEach(function (command) {
		context.subscriptions.push(vscode.commands.registerCommand(
			command.name,
			command.behavior(vscode.window.activeTextEditor, formatDocument)
		));
	});

	context.subscriptions.push(vscode.commands.registerCommand(
		'cmstead.jsRefactor.rename',
		function () {
			vscode.commands.executeCommand("editor.action.rename");
		}
	));

}


function deactivate() { /* noop */ }

exports.activate = activate;
exports.deactivate = deactivate;
