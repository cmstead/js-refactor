'use strict';

var registeredCommands = {};

function registerCommand (key, action){
    registeredCommands[key] = action;
}

function getRegisteredCommand (key){
    return registeredCommands[key];
}

function getRegisteredCommandList (){
    return registeredCommands;
}

module.exports = {
    commands: {
        registerCommand: registerCommand,
        getRegisteredCommand: getRegisteredCommand,
        getRegisteredCommandList: getRegisteredCommandList
    }
};