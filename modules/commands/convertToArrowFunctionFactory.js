'use strict';

function convertToArrowFunctionFactory(
    coordsHelper,
    editActionsFactory,
    logger,
    parser,
    selectionExpressionHelper,
    selectionHelper,
    templateHelper,
    vsCodeHelperFactory
) {

    return function (callback) {
        const vsCodeHelper = vsCodeHelperFactory();

        function getBodyContent(nearestFunctionExpression, sourceLines) {
            const functionBody = nearestFunctionExpression.body.body;
            const isSingleLineBody = nearestFunctionExpression.body.body.length === 1;

            const bodyContent = selectionHelper
                .getMultiExpressionSelection(functionBody, sourceLines)
                .join('\n');

            return isSingleLineBody ? bodyContent.replace('return ', '') : bodyContent;
        }

        function getArgsContent(nearestFunctionExpression, sourceLines) {
            if ((nearestFunctionExpression.params).length != 0) {
                const argumentsContentAstCoords = coordsHelper.getOuterAstCoords(nearestFunctionExpression.params);
                const argumentsContentEditorCoords = coordsHelper.coordsFromAstToEditor(argumentsContentAstCoords);

                return selectionHelper.getSelection(sourceLines, argumentsContentEditorCoords).join('\n');
            }
            else {
                return "";
            }
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
            const expressionId = nearestFunctionExpression.id;
            return expressionId !== null ? expressionId.name : '';
        }

        function buildArrowFunctionContext(nearestFunctionExpression, sourceLines) {
            return {
                name: getFunctionName(nearestFunctionExpression),
                body: getBodyContent(nearestFunctionExpression, sourceLines),
                args: getArgsContent(nearestFunctionExpression, sourceLines)
            };
        }

        function getLastCharacter(value) {
            return value[value.length - 1];
        }

        function isLastCharacterASemicolon(value) {
            const lastCharacter = getLastCharacter(value);
            return lastCharacter === ';';
        }

        function cleanArrowFunction (arrowFunctionString) {
            let resultFunction =  arrowFunctionString.trim();

            while(isLastCharacterASemicolon(resultFunction)) {
                resultFunction = resultFunction.slice(0, resultFunction.length - 1);
            }
            
            return resultFunction;
        }

        function applyConversion(nearestFunctionExpression, sourceLines) {
            const activeEditor = vsCodeHelper.getActiveEditor();
            const functionEditorCoords = coordsHelper.coordsFromAstToEditor(nearestFunctionExpression.loc);
            const arrowFunctionContext = buildArrowFunctionContext(nearestFunctionExpression, sourceLines);
            const unsanitizedArrowFunction = getTemplateBuilder(nearestFunctionExpression).build(arrowFunctionContext);
            const arrowFunction = cleanArrowFunction(unsanitizedArrowFunction);

            editActionsFactory(activeEditor)
                .applySetEdit(arrowFunction, functionEditorCoords)
                .then(callback);
        }

        return function () {
            const selectionEditorCoords = vsCodeHelper.getSelectionCoords();
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const sourceLines = vsCodeHelper.getSourceLines();
            const ast = parser.parseSourceLines(sourceLines);
            const nearestFunctionExpression = selectionExpressionHelper.getNearestFunctionExpression(selectionAstCoords, ast);

            if (nearestFunctionExpression === null) {
                logger.info('No acceptable function found which can be converted to arrow function.');
            } else {
                applyConversion(nearestFunctionExpression, sourceLines)
            }
        };
    };
}

module.exports = convertToArrowFunctionFactory;