'use strict';

function extractMethodFactory(
    coordsHelper,
    editActionsFactory,
    extractHelper,
    logger,
    parser,
    scopeHelper,
    selectionExpressionHelper,
    selectionHelper,
    selectionVariableHelper,
    templateHelper,
    vsCodeHelperFactory
) {


    return function (callback) {

        const vsCodeHelper = vsCodeHelperFactory();

        function getUnboundVars(selectionAstCoords, destinationAstCoords, ast) {
            const astCoords = coordsHelper.coordsFromEditorToAst(selectionAstCoords);
            const unboundVars = selectionVariableHelper.getUnboundVars(astCoords, destinationAstCoords, ast);
            return unboundVars.join(', ');
        }

        function getFunctionName(callback) {
            const inputOptions = {
                prompt: 'Name of your function'
            };

            logger.input(inputOptions, callback);
        }

        function buildFunctionStrings(context, selectedScope) {
            const scopeIsObject = extractHelper.isObjectScope(selectedScope);

            const functionTemplateKey = scopeIsObject ? 'method' : 'function';
            const functionCallTemplateKey = scopeIsObject ? 'methodCall' : 'functionCall';

            const newFunction = templateHelper.templates[functionTemplateKey].build(context);
            const newFunctionCall = templateHelper.templates[functionCallTemplateKey].build(context);

            return {
                newFunction: newFunction,
                newFunctionCall: newFunctionCall
            };
        }

        function buildFunctionBody(selectedLines, ast) {
            const lastExpression = selectionExpressionHelper.getLastIndependentExpression(ast);

            const lastExpressionEditorCoords = lastExpression.type === 'ExpressionStatement'
                ? coordsHelper.coordsFromAstToEditor(lastExpression.expression.loc)
                : coordsHelper.coordsFromAstToEditor(lastExpression.loc);

            const bodyStartEditorCoords = {
                start: [1, 0],
                end: [
                    lastExpressionEditorCoords.start[0],
                    lastExpressionEditorCoords.start[1]
                ]
            };

            let bodyStart = selectionHelper.getSelection(selectedLines, bodyStartEditorCoords);
            let lastExpressionSelection = selectionHelper.getSelection(selectedLines, lastExpressionEditorCoords);

            if (bodyStart.length === 1 && bodyStart[0].trim() === '') {
                bodyStart = [];
            }

            if (lastExpression.type === 'VariableDeclaration') {
                lastExpressionSelection.push(`return ${lastExpression.id.name};`);
            } else if (lastExpression.type !== 'MemberExpression') {
                const lastIndex = lastExpressionSelection.length - 1;
                lastExpressionSelection[0] = `return ${lastExpressionSelection[0]}`;
                lastExpressionSelection[lastIndex] = lastExpressionSelection[lastIndex] + ';';
            }

            return bodyStart.concat(lastExpressionSelection).join('\n');
        }

        function buildInitialExtractMethodContext(selectedLines) {
            const wrappedSelectionLines = ['('].concat(selectedLines).concat([')']);
            let body;

            try {
                const ast = parser.parseSourceLines(wrappedSelectionLines);
                body = buildFunctionBody(wrappedSelectionLines, ast);
            } catch (e) {
                body = selectedLines.join('\n');
            }

            return {
                selectedOptionIndex: 0,
                name: '',
                body: body,
                arguments: ''
            };
        }

        function applyExtractMethod(sourceLines, selectionEditorCoords, extractMethodContext) {
            const activeEditor = vsCodeHelper.getActiveEditor();

            const ast = parser.parseSourceLines(sourceLines);
            const scopePath = extractHelper.getScopePath(selectionEditorCoords, ast);

            scopeHelper.getScopeQuickPick(scopePath, sourceLines, function (selectedOption) {
                getFunctionName(function (functionName) {
                    const selectedOptionIndex = scopeHelper.getSelectedScopeIndex(selectedOption);
                    const destinationScope = scopePath[selectedOptionIndex];

                    extractMethodContext.arguments = getUnboundVars(selectionEditorCoords, destinationScope.loc, ast);
                    extractMethodContext.name = functionName;

                    const { newFunction, newFunctionCall } = buildFunctionStrings(extractMethodContext, destinationScope);

                    const newMethodLocation = extractHelper
                        .getNewExtractionLocation(
                        scopePath,
                        selectedOptionIndex,
                        selectionEditorCoords,
                        ast
                        );


                    editActionsFactory(activeEditor).applySetEdit(newFunctionCall, selectionEditorCoords).then(function () {
                        editActionsFactory(activeEditor).applySetEdit(newFunction, newMethodLocation).then(callback);
                    });
                });
            });
        }

        return function () {
            const selectionEditorCoords = vsCodeHelper.getSelectionCoords();

            const sourceLines = vsCodeHelper.getSourceLines();
            const selectedLines = selectionHelper.getSelection(sourceLines, selectionEditorCoords);

            const extractMethodContext = buildInitialExtractMethodContext(selectedLines);

            if (selectionHelper.isEmptySelection(selectionEditorCoords)) {
                logger.info('Cannot extract an empty selection as a method.');
            } else {
                applyExtractMethod(sourceLines, selectionEditorCoords, extractMethodContext);
            }

        }
    }

}

module.exports = extractMethodFactory;