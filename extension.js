function activate(context) {
	var container = require('./container');
	var vscode = container.build('vsCodeFactory').get();

	container
		.build('commandDefFactory')(container)
		.forEach(function (command) {
			context.subscriptions.push(
				vscode.commands.registerCommand(
					command.name,
					command.behavior));
		});

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'cmstead.jsRefactor.rename',
			() => vscode.commands.executeCommand("editor.action.rename")
		));
}


function deactivate() { /* noop */ }

exports.activate = activate;
exports.deactivate = deactivate;
