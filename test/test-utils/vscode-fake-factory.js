'use strict';

const motherContainer = require('./mother-container');

function buildVscodeFake() {
    return {
        commands: {
            registerCommand: function () { }
        },
        window: {
            activeTextEditor: motherContainer.buildData('activeTextEditor'),
            showInformationMessage: function () { }
        }
    };
}

module.exports = buildVscodeFake;