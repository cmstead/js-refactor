function extractVariableOptionsBuilder(
    selectionUtils,
    types
) {

    function getVariableTypes() {
        return [
            'const',
            'let',
            'var'
        ]
    }

    function getScopeOptions(scopePath, sourceLines) {
        return scopePath.map(function (scopeNode, index) {
            return `${index}: ${selectionUtils.getFirstLine(scopeNode.loc, sourceLines)}`;
        });
    }

    return {
        getScopeOptions: types.enforce(
            'array<astNode>, array<string> => array<string>',
            getScopeOptions
        ),
        getVariableTypes: types.enforce(
            '() => array<string>',
            getVariableTypes
        )
    };
}

module.exports = extractVariableOptionsBuilder;