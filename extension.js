const semverCompare = require('semver-compare');
const packageData = require('./package.json');

const JSREFACTORVERSION = "jsrefactorversion";

function activate(context) {
	
	var container = require('./container');
	var vscode = container.build('vscodeFactory').get();
	const versionData = getVersionData(context);

	vscode.window.showInformationMessage('JS Refactor is deprecated. Please consider using JS CodeFormer!');

	displayPatreonPopup(versionData, container);
	updateVersion(versionData, context);

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

function getVersionData(context) {
	const previousVersion = context.globalState.get(JSREFACTORVERSION, "0.0.0");
	const currentVersion = packageData.version;

	return {
		previousVersion,
		currentVersion
	};
}

function updateVersion(
	{
		previousVersion,
		currentVersion
	},
	context
) {
	if(previousVersion !== currentVersion) {
		context.globalState.update(JSREFACTORVERSION, currentVersion);
	}
}

function displayPatreonPopup(
	{
		previousVersion,
		currentVersion
	},
	container
) {
	const logger = container.build('logger');

	if (semverCompare(previousVersion, currentVersion) > 0) {
		//display patreon message
		logger.info(`Like JS Refactor? Consider donating: https://www.patreon.com/sdlcpunk`);
	}

}

exports.activate = activate;
exports.deactivate = deactivate;
