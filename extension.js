var vscode = require('vscode');
var loggerFactory = require('./modules/logger-factory');
var selectionFactory = require('./modules/selection-factory');
var addLine = require('./modules/add-line');
var wrapInFunction = require('./modules/wrap-in-function')

function activate(context) {
    var logger = loggerFactory();

	context.subscriptions.push(vscode.commands.registerCommand('jsRefactor.wrapInFunction', function () {
        wrapInFunction(vscode.window.activeTextEditor);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand('jsRefactor.wrapInIIFE', function () {
        logger.log('Wrap in IIFE');
	}));
	
}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;