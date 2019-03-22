function markAsAsyncFactory(
    coordsHelper,
    editActionsFactory,
    logger,
    parser,
    selectionExpressionHelper,
    selectionHelper,
    vsCodeHelperFactory
) {
    'use strict';

    return function (callback) {
        const vsCodeHelper = vsCodeHelperFactory();

        function getFunctionSourceLines(nearestFunctionExpression, sourceLines) {
            const selectionAstCoords = coordsHelper.coordsFromAstToEditor(nearestFunctionExpression.loc);
            return selectionHelper.getSelection(sourceLines, selectionAstCoords);

        }

        function isAsyncFunction(functionSourceLines) {
            const trimmedFirstLine = functionSourceLines[0].trim();

            return /^async/.test(trimmedFirstLine);
        }

        function applyAsyncEdit(functionSourceLines, nearestFunctionExpression) {
            if(!isAsyncFunction(functionSourceLines)) {
                const functionEditorCoords = coordsHelper.coordsFromAstToEditor(nearestFunctionExpression.loc);
                const activeEditor = vsCodeHelper.getActiveEditor();
    
                functionSourceLines[0] = 'async ' + functionSourceLines[0].trim();
                const functionSource = functionSourceLines.join('\n');
    
                editActionsFactory(activeEditor)
                    .applySetEdit(functionSource, functionEditorCoords)
                    .then(callback);
            }
        }

        function getNearestFunctionOrLambda(selectionAstCoords, ast) {
            let nearFunctionOrMethod = selectionExpressionHelper.getNearestMethodDeclaration(selectionAstCoords, ast);
            nearFunctionOrMethod = nearFunctionOrMethod === null
                ? selectionExpressionHelper.getNearestFunctionExpression(selectionAstCoords, ast)
                : nearFunctionOrMethod;

            return nearFunctionOrMethod === null
                ? selectionExpressionHelper.getNearestArrowFunction(selectionAstCoords, ast)
                : nearFunctionOrMethod;
        }

        return function () {
            const selectionEditorCoords = vsCodeHelper.getSelectionCoords();
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const sourceLines = vsCodeHelper.getSourceLines();
            const ast = parser.parseSourceLines(sourceLines);

            const nearestFunctionExpression = getNearestFunctionOrLambda(selectionAstCoords, ast)

            if (nearestFunctionExpression === null) {
                logger.info('Cannot find appropriate function to mark as async.');
            } else {
                const functionSourceLines = getFunctionSourceLines(nearestFunctionExpression, sourceLines);
                applyAsyncEdit(functionSourceLines, nearestFunctionExpression);
            }
        }
    };
}

module.exports = markAsAsyncFactory;