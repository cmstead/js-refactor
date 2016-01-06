var vscode = require('vscode');
var loggerFactory = require('./modules/logger.util').loggerFactory;
var selectionFactory = require('./modules/text-selector').selectionFactory;

function activate(context) {

	var disposable = vscode.commands.registerCommand('extension.jsRefactor', function () {
        var logger = loggerFactory();
        var selection = selectionFactory(vscode.window.activeTextEditor);
        console.log(selection.getSelection(0));
	});
	
	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;