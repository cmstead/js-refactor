'use strict';

function introduceFunctionFactory(
    coordsHelper,
    editActionsFactory,
    extractHelper,
    logger,
    parser,
    scopeHelper,
    selectionCoordsHelper,
    selectionExpressionHelper,
    templateHelper,
    utilities,
    vsCodeFactory
) {

    function getUsageValueNode(node) {
        if (node.type === 'Property') {
            return node.value
        } else if (node.type === 'CallExpression') {
            return node.callee;
        } else {
            return node.declarations[0].init;
        }
    }

    function isValidUsageNode(node) {
        return getUsageValueNode(node).type === 'Identifier';
    }

    return function (callback) {
        return function () {
            const activeEditor = vsCodeFactory.get().window.activeTextEditor;
            const editActions = editActionsFactory(activeEditor);

            const selectionEditorCoords = selectionCoordsHelper.getSelectionEditorCoords(activeEditor);
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const sourceLines = utilities.getDocumentLines(activeEditor);
            const ast = parser.parseSourceLines(sourceLines);
            const scopePath = scopeHelper
                .getScopePath(selectionEditorCoords, ast)
                .filter(node => node.type.toLowerCase().indexOf('object') === -1);

            const selectedNode = selectionExpressionHelper.getNearestUsageNode(selectionAstCoords, ast);

            if (selectedNode === null || !isValidUsageNode(selectedNode)) {
                logger.info('Unable to find appropriate identifier');
            } else {
                scopeHelper.getScopeQuickPick(scopePath, sourceLines, function (selectedOption) {
                    const selectedOptionIndex = scopeHelper.getSelectedScopeIndex(selectedOption);
                    
                    const newMethodLocation = extractHelper
                        .getNewExtractionLocation(scopePath, selectedOptionIndex, selectionEditorCoords, ast);

                    const functionContext = {
                        name: getUsageValueNode(selectedNode).name,
                        arguments: '',
                        body: ''
                    };

                    const functionString = templateHelper.templates.function.build(functionContext);
                    
                    editActions.applySetEdit(functionString, newMethodLocation).then(callback);
                });
            }
        };
    };

}

module.exports = introduceFunctionFactory;