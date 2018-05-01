'use strict';

function convertToFunctionExpressionFactory(
    coordsHelper,
    editActionsFactory,
    logger,
    parser,
    selectionExpressionHelper,
    selectionHelper,
    templateHelper,
    typeHelper,
    vsCodeHelperFactory
) {

    return function (callback) {
        const vsCodeHelper = vsCodeHelperFactory();

        function getBodyNodeArray(functionBody) {
            return typeHelper.isTypeOf('array')(functionBody)
                ? functionBody
                : [functionBody];
        }

        function getFunctionBody(nearestFunctionExpression) {
            const arrowBody = nearestFunctionExpression.body;

            return arrowBody.type === 'BlockStatement'
                ? arrowBody.body
                : arrowBody;
        }

        function buildBodyContent(bodyNodeArray, sourceLines) {
            return selectionHelper
                .getMultiExpressionSelection(bodyNodeArray, sourceLines)
                .join('\n');
        }

        function getBodyContent(nearestFunctionExpression, sourceLines) {
            const functionBody = getFunctionBody(nearestFunctionExpression);
            const bodyNodeArray = getBodyNodeArray(functionBody);
            const isMultilineBody = bodyNodeArray.length > 1;

            const bodyContent = buildBodyContent(bodyNodeArray, sourceLines);

            return isMultilineBody
                ? bodyContent
                : `return ${bodyContent};`;
        }

        function getArgsContent(nearestFunctionExpression, sourceLines) {

            if (nearestFunctionExpression.params.length > 0) {
                const argumentsContentAstCoords = coordsHelper.getOuterAstCoords(nearestFunctionExpression.params);
                const argumentsContentEditorCoords = coordsHelper.coordsFromAstToEditor(argumentsContentAstCoords);

                return selectionHelper.getSelection(sourceLines, argumentsContentEditorCoords).join('\n');
            } else {
                return '';
            }
        }

        function getTemplateBuilder() {
            return templateHelper.templates.function;
        }

        function getFunctionName(nearestFunctionExpression) {
            const expressionId = nearestFunctionExpression.id;
            return expressionId !== null ? expressionId.name : '';
        }

        function buildArrowFunctionContext(nearestFunctionExpression, sourceLines) {
            return {
                name: getFunctionName(nearestFunctionExpression),
                body: getBodyContent(nearestFunctionExpression, sourceLines),
                arguments: getArgsContent(nearestFunctionExpression, sourceLines)
            };
        }

        function applyConversion(nearestArrowFunction, sourceLines) {
            const activeEditor = vsCodeHelper.getActiveEditor();

            const functionEditorCoords = coordsHelper.coordsFromAstToEditor(nearestArrowFunction.loc);
            const arrowFunctionContext = buildArrowFunctionContext(nearestArrowFunction, sourceLines);

            const arrowFunction = getTemplateBuilder(nearestArrowFunction).build(arrowFunctionContext);

            editActionsFactory(activeEditor)
                .applySetEdit(arrowFunction, functionEditorCoords)
                .then(callback);
        }

        return function () {
            const selectionEditorCoords = vsCodeHelper.getSelectionCoords();
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const sourceLines = vsCodeHelper.getSourceLines();
            const ast = parser.parseSourceLines(sourceLines);

            const nearestArrowFunction = selectionExpressionHelper.getNearestArrowFunction(selectionAstCoords, ast);

            if (nearestArrowFunction === null) {
                logger.info('No acceptable arrow function found which can be converted to a function expression.');
            } else {
                applyConversion(nearestArrowFunction, sourceLines)
            }
        };
    };
}

module.exports = convertToFunctionExpressionFactory;