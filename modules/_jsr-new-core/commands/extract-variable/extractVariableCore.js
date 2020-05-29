function extractVariableCore(
    extractVariableOptionsBuilder,
    types,
    userInput,
    variableExtractionScopeFinder
) {

    function getExtractionScopePath(selectionCoordinates, sourceAst) {
        return variableExtractionScopeFinder.findScopePath(selectionCoordinates, sourceAst);
    }

    function getScopeNode(scopePath, selectedScope) {
        const selectionTokens = selectedScope.split(':');
        const scopeId = parseInt(selectionTokens[0]);

        return scopePath[scopeId];
    }

    function getExtractionNode(scopePath, sourceLines) {
        const scopeChoices = extractVariableOptionsBuilder.getScopeOptions(scopePath, sourceLines);
        const quickPickOptions = userInput.getBaseQuickPickOptions('Choose scope location for extracted variable')

        return userInput
            .showQuickPick(scopeChoices, quickPickOptions)
            .then(function (selectedScope) {
                return getScopeNode(scopePath, selectedScope);
            })
            .catch(function (error) {
                const message = error.message.startsWith('Invalid selection')
                    ? 'Invalid scope selection for extract variable'
                    : error.message;

                throw new Error(message);
            });
    }

    return {
        getExtractionNode: types.enforce(
            'array<astNode> => promise',
            getExtractionNode
        ),
        getExtractionScopePath: types.enforce(
            'astLocation, astNode => array<astNode>',
            getExtractionScopePath
        )
    };
}

module.exports = extractVariableCore;