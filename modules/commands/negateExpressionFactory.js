'use strict';

function negateExpressionFactory(
    coordsHelper,
    editActionsFactory,
    logger,
    parser,
    selectionExpressionHelper,
    selectionHelper,
    vsCodeHelperFactory
) {

    return function (callback) {
        const vsCodeHelper = vsCodeHelperFactory();

        function negateExpression(expressionString, selectedExpressionNode) {
            const test = selectedExpressionNode.test;

            if(test.type === 'UnaryExpression' && test.operator === '!') {
                return expressionString.substring(1);
            } else if(test.type === 'LogicalExpression') {
                return '!(' + expressionString + ')';
            } else {
                return '!' + expressionString;
            }
        }

        return function applyNegateExpression() {
            const activeEditor = vsCodeHelper.getActiveEditor();
            const editActions = editActionsFactory(activeEditor);

            const selectionEditorCoords = vsCodeHelper.getSelectionCoords();
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const sourceLines = vsCodeHelper.getSourceLines();
            const ast = parser.parseSourceLines(sourceLines);

            const nearestIfCondition = selectionExpressionHelper.getNearestIfCondition(selectionAstCoords, ast);

            if(nearestIfCondition === null) {
                logger.info('Cannot invert expression outside of an if condition');
            } else {
                const testExpressionEditorCoords = coordsHelper.coordsFromAstToEditor(nearestIfCondition.test.loc);
                const selectedExpression = selectionHelper.getSelection(sourceLines, testExpressionEditorCoords).join('\n');
                
                const negatedExpression = negateExpression(selectedExpression, nearestIfCondition);

                editActions.applySetEdit(negatedExpression, testExpressionEditorCoords).then(callback);
            }
        }

    };

}

module.exports = negateExpressionFactory;