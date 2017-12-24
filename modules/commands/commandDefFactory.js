'use strict';

function commandDefFactory() {
    return function (container) {
        const extensionPrefix = 'cmstead.jsRefactor';
        const vscode = container.build('vsCodeFactory').get();

        const formatName = "editor.action.formatDocument";
        const formatDocument = vscode.commands.executeCommand.bind(vscode.commands, formatName);

        const commandActionData = require('../json/commandActionData');
        const actions = Object
            .keys(commandActionData)
            .reduce(function (result, key) {
                const command = commandActionData[key].command;

                result[key] = command;
                return result;
            }, {});

        return Object
            .keys(actions)
            .map(function (key) {
                return {
                    name: `${extensionPrefix}.${key}`,
                    behavior: () => container.build(actions[key])(formatDocument)()
                };
            });
    }

}

module.exports = commandDefFactory;