function userInput (
    types,
    vscodeFactory
) {
    
    const vscode = vscodeFactory.get();

    function getBaseQuickPickOptions(placeholder) {
        return {
            ignoreFocusOut: true,
            placeholder: placeholder
        };
    }

    function showQuickPick(choices, options) {
        return vscode.window.showQuickPick(choices, options);
    }

    return {
        showQuickPick: types.enforce(
            'array<string>, quickPickOptions => promise',
            showQuickPick
        ),
        getBaseQuickPickOptions: types.enforce(
            'string => quickPickOptions',
            getBaseQuickPickOptions
        )
    };
}

module.exports = userInput;