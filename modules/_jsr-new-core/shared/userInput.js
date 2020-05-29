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

    function throwOnBadSelectionValue(selectionValue, message) {
        if(typeof selectionValue !== 'string' || selectionValue.trim() === '') {
            throw new Error(message);
        }
    }

    function showQuickPick(choices, options) {
        return vscode.window
            .showQuickPick(choices, options)
            .then(function (selectionValue) {
                throwOnBadSelectionValue(selectionValue, `Invalid selection value: "${selectionValue}", type: "${typeof selectionValue}"`);
                return selectionValue;
            });
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