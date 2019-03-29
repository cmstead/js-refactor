function convertToFunctionDeclarationFactory(
    coordsHelper,
    editActionsFactory,
    logger,
    parser,
    selectionExpressionHelper,
    selectionHelper,
    templateHelper,
    vsCodeHelperFactory

) {
    'use strict';

    return function (callback) {

        const vsCodeHelper = vsCodeHelperFactory();

        function getFunctionExpressionString(nearestFunctionAssignment, sourceLines) {
            const functionExpression = nearestFunctionAssignment.init;
            const functionExpressionEditorLocation = coordsHelper.coordsFromAstToEditor(functionExpression.loc);
            const functionExpressionLines = selectionHelper.getSelection(sourceLines, functionExpressionEditorLocation);

            return functionExpressionLines.join('\n');
        }

        function getFunctionDeclarationString(nearestFunctionAssignment, sourceLines) {
            const functionExpressionString = getFunctionExpressionString(nearestFunctionAssignment, sourceLines);
            const functionName = nearestFunctionAssignment.id.name;

            return functionExpressionString.replace(/^function\s*\(/, `function ${functionName}(`);

        }

        function writeFunctionDeclarationToDocument(functionDeclarationString, nearestFunctionAssignment) {
            const activeEditor = vsCodeHelper.getActiveEditor();
            const functionExpression = nearestFunctionAssignment.init;
            const functionExpressionEditorLocation = coordsHelper.coordsFromAstToEditor(functionExpression.loc);

            const editActions = editActionsFactory(activeEditor);

            editActions
                .applySetEdit(functionDeclarationString, functionExpressionEditorLocation)
                .then(callback);
        }

        return function () {
            const selectionEditorCoords = vsCodeHelper.getSelectionCoords();
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const sourceLines = vsCodeHelper.getSourceLines();
            const ast = parser.parseSourceLines(sourceLines);

            const nearestFunctionAssignment = selectionExpressionHelper.getNearestFunctionAssignment(selectionAstCoords, ast);

            if (nearestFunctionAssignment === null) {
                logger.info('Unable to locate an appropriate function assignment to convert');
            } else {
                const functionDeclarationString = getFunctionDeclarationString(nearestFunctionAssignment, sourceLines)

                writeFunctionDeclarationToDocument(functionDeclarationString, nearestFunctionAssignment);
            }

        };
    };
}

module.exports = convertToFunctionDeclarationFactory;