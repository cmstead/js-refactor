var container = require('./container');

function activate(context) {
	var vscode = container.build('vsCodeFactory').get();

	container.build('commandDefFactory')(container).forEach(function (command) {
		context.subscriptions.push(vscode.commands.registerCommand(
			command.name,
			command.behavior
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
