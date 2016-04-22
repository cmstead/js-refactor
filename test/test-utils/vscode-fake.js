'use strict';

var registeredCommands = {};

function registerCommand(key, action) {
    registeredCommands[key] = action;
}

function getRegisteredCommand(key) {
    return registeredCommands[key];
}

function getRegisteredCommandList() {
    return registeredCommands;
}

var selections = [
    {
        _start: {
            _line: 0,
            _character: 0
        },
        _end: {
            _line: 0,
            _character: 0
        }
    }
];

var options = {
    tabSize: 4,
    insertSpaces: true
};

var documentData = {
    _selections: selections,
    options: options
}


module.exports = {
    window: {
        activeTextEditor: {
            _documentData: documentData
        }
    },

    commands: {
        registerCommand: registerCommand,
        getRegisteredCommand: getRegisteredCommand,
        getRegisteredCommandList: getRegisteredCommandList
    }
};