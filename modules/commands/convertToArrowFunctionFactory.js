'use strict';

function convertToArrowFunctionFactory(
    astHelper,
    coordsHelper,
    editActionsFactory,
    logger,
    parser,
    selectionExpressionHelper,
    selectionHelper,
    templateHelper,
    utilities,
    vsCodeFactory) {

    return function (callback) {

        function first(values) {
            return values[0];
        }

        function last(values) {
            return values[values.length - 1];
        }

        function getOuterAstCoords(expressionArray) {
            return {
                start: first(expressionArray).loc.start,
                end: last(expressionArray).loc.end
            }
        }

        function getSelectionEditorCoords(activeEditor) {
            const firstSelectionCoords = utilities.getAllSelectionCoords(activeEditor)[0];
            return coordsHelper.coordsFromDocumentToEditor(firstSelectionCoords);
        }

        function getBodyContent(nearestFunctionExpression, sourceLines) {
            const bodyContentAstCoords = getOuterAstCoords(nearestFunctionExpression.body.body);
            const bodyContentEditorCoords = coordsHelper.coordsFromAstToEditor(bodyContentAstCoords);

            const bodyContent = selectionHelper.getSelection(sourceLines, bodyContentEditorCoords).join('\n');

            return nearestFunctionExpression.body.body.length === 1
                ? bodyContent.replace('return ', '')
                : bodyContent;
        }

        function getArgsContent(nearestFunctionExpression, sourceLines) {
            const argumentsContentAstCoords = getOuterAstCoords(nearestFunctionExpression.params);
            const argumentsContentEditorCoords = coordsHelper.coordsFromAstToEditor(argumentsContentAstCoords);

            return selectionHelper.getSelection(sourceLines, argumentsContentEditorCoords).join('\n');
        }

        function getTemplateBuilder(nearestFunctionExpression) {
            const isMultiline = nearestFunctionExpression.body.body.length > 1;
            const isNamed = Boolean(nearestFunctionExpression.id);

            if (isNamed && isMultiline) {
                return templateHelper.templates.namedMultilineArrowFunction;
            } else if (isMultiline) {
                return templateHelper.templates.multilineArrowFunction;
            } else if (isNamed) {
                return templateHelper.templates.namedSingleLineArrowFunction;
            } else {
                return templateHelper.templates.singleLineArrowFunction;
            }
        }

        function getFunctionName(nearestFunctionExpression) {
            return nearestFunctionExpression.id
                ? nearestFunctionExpression.id.name
                : '';
        }

        function applyConversion(activeEditor, nearestFunctionExpression, sourceLines) {
            const editActions = editActionsFactory(activeEditor);

            const arrowFunctionContext = {
                name: getFunctionName(nearestFunctionExpression),
                body: getBodyContent(nearestFunctionExpression, sourceLines),
                args: getArgsContent(nearestFunctionExpression, sourceLines)
            };

            const arrowFunction = getTemplateBuilder(nearestFunctionExpression).build(arrowFunctionContext);
            const functionEditorCoords = coordsHelper.coordsFromAstToEditor(nearestFunctionExpression.loc);

            editActions.applySetEdit(arrowFunction, functionEditorCoords).then(callback);
        }

        return function () {
            const activeEditor = vsCodeFactory.get().window.activeTextEditor;
            const selectionEditorCoords = getSelectionEditorCoords(activeEditor);
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const sourceLines = utilities.getDocumentLines(activeEditor);
            const ast = parser.parseSourceLines(sourceLines);

            const nearestFunctionExpression = selectionExpressionHelper.getNearestFunctionExpression(selectionAstCoords, ast);

            if (nearestFunctionExpression === null) {
                logger.info('No acceptable function found which can be converted to arrow function.');
            } else {
                applyConversion(activeEditor, nearestFunctionExpression, sourceLines)
            }
        };
    };
}

module.exports = convertToArrowFunctionFactory;