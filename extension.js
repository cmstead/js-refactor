var vscode = require('vscode');
var loggerFactory = require('./modules/logger-factory');
var selectionFactory = require('./modules/selection-factory');
var addLine = require('./modules/add-line');

function activate(context) {

	var disposable = vscode.commands.registerCommand('extension.jsRefactor', function () {
        var logger = loggerFactory(),
            selection = selectionFactory(vscode.window.activeTextEditor).getSelection(0),
            selectionStr = selection === null ? 'null' : selection.toString();
        
        addLine();

        logger.log(selectionStr);
	});
	
	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;