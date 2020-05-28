// function quickPick(items, options, callback) {
//     vscode.window.showQuickPick(items, options).then(callback);
// }

function userInput (
    types
) {
    
    function getDefaultQuickPickOptions(placeholder) {
        return {
            ignoreFocusOut: true,
            placeholder: placeholder
        };
    }

    function showQuickPick(choices, options) {

    }

    return {
        showQuickPick: types.enforce(
            'array<string>, quickPickOptions => promise',
            showQuickPick
        )
    };
}

module.exports = userInput;