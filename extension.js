var container = require('./container');

function activate(context) {
	var vscode = container.build('vsCodeFactory').get();
	var activeEditor = vscode.window.activeTextEditor;
	var formatSelection = vscode.commands.executeCommand.bind(vscode.commands, "editor.action.formatSelection");

	container.build('commandDefFactory').forEach(registerCommand);

	function registerCommand(command) {
		var behavior = command.behavior(activeEditor, formatSelection);

		context.subscriptions.push(vscode.commands.registerCommand(command.name, behavior));
	}
}

function deactivate() { /* noop */ }

exports.activate = activate;
exports.deactivate = deactivate;