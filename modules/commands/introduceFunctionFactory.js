'use strict';

function introduceFunctionFactory(
    coordsHelper,
    editActionsFactory,
    extractHelper,
    logger,
    parser,
    scopeHelper,
    selectionExpressionHelper,
    templateHelper,
    vsCodeHelperFactory
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
        const vsCodeHelper = vsCodeHelperFactory();

        return function () {
            const activeEditor = vsCodeHelper.getActiveEditor();
            const editActions = editActionsFactory(activeEditor);

            const selectionEditorCoords = vsCodeHelper.getSelectionCoords();
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const sourceLines = vsCodeHelper.getSourceLines();
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