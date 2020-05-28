function buildFake() {
    return {
        window: {
            activeTextEditor: {
                _selections: []
            }
        }
    }
}

function addSelection(vscodeFakeInstance, selection) {
    vscodeFakeInstance.window.activeTextEditor._selections.push(selection);
}

module.exports = {
    addSelection,
    buildFake
}