var container = require('./container');
var fs = require('fs');

function activate(context) {
	container.loadModule('utilities');
	var vscode = container.build('vsCodeFactory').get();
	var formatSelection = vscode.commands.executeCommand.bind(vscode.commands, "editor.action.formatSelection");

	container.build('commandDefFactory').forEach(function (command) {
		context.subscriptions.push(vscode.commands.registerCommand(
			command.name,
			command.behavior(vscode.window.activeTextEditor, formatSelection)
		));
	});

}


function deactivate() { /* noop */ }

exports.activate = activate;
exports.deactivate = deactivate;
