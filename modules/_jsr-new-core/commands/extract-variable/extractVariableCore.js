function extractVariableCore(
    extractVariableOptionsBuilder,
    nodeTypeMap,
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

    function getDeclaratorType() {
        const quickPickOptions = userInput.getBaseQuickPickOptions('Choose a variable type');
        const declaratorTypes = extractVariableOptionsBuilder.getVariableTypes();

        return userInput
            .showQuickPick(declaratorTypes, quickPickOptions)
            .catch(function(error) {
                const message = error.message.startsWith('Invalid selection')
                    ? 'Invalid variable type. Variables can only be const, let, or var'
                    : error.message;

                throw new Error(message);
            });
    }

    function getVariableType(node) {
        return node.type === nodeTypeMap.OBJECT_EXPRESSION
            ? 'property'
            : 'variable';
    } 

    return {
        getDeclaratorType: types.enforce(
            '() => promise',
            getDeclaratorType
        ),
        getExtractionNode: types.enforce(
            'array<astNode> => promise',
            getExtractionNode
        ),
        getExtractionScopePath: types.enforce(
            'astLocation, astNode => array<astNode>',
            getExtractionScopePath
        ),
        getVariableType: types.enforce(
            'astNode => string',
            getVariableType
        )
    };
}

module.exports = extractVariableCore;