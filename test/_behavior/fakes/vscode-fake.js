const sinon = require('sinon');

function buildFake() {
    return {
        window: {
            activeTextEditor: {
                _selections: [],
                _documentData: {
                    _lines: []
                }
            },
            showQuickPick: sinon.stub().returns(Promise.resolve(true))
        }
    }
}

function addSelection(vscodeFakeInstance, selection) {
    vscodeFakeInstance.window.activeTextEditor._selections.push(selection);
}

function setSourceLines(vscodeFakeInstance, sourceLines) {
    vscodeFakeInstance.window.activeTextEditor._documentData._lines = sourceLines;
}

module.exports = {
    addSelection,
    buildFake,
    setSourceLines
}