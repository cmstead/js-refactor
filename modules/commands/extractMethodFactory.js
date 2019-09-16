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

        function getFunctionTemplateKey(selectedScope) {
            let functionTemplateKey = null;

            if (extractHelper.isObjectScope(selectedScope)) {
                functionTemplateKey = 'method';
            } else if (extractHelper.isClassScope(selectedScope)) {
                functionTemplateKey = 'classMethod';
            } else {
                functionTemplateKey = 'function';
            }

            return functionTemplateKey;
        }

        function buildFunctionStrings(context, selectedScope) {
            const functionTemplateKey = getFunctionTemplateKey(selectedScope);
            const functionCallTemplateKey = functionTemplateKey === 'function'
                ? 'functionCall'
                : 'methodCall';

            const newFunction = templateHelper.templates[functionTemplateKey].build(context);
            const newFunctionCall = templateHelper.templates[functionCallTemplateKey].build(context);

            return {
                newFunction: newFunction,
                newFunctionCall: newFunctionCall
            };
        }

        function getLastExpressionEditorCoords(lastExpression) {
            return lastExpression.type === 'ExpressionStatement'
                ? coordsHelper.coordsFromAstToEditor(lastExpression.expression.loc)
                : coordsHelper.coordsFromAstToEditor(lastExpression.loc);
        }

        function buildBodyStartEditorCoords(lastExpressionEditorCoords) {
            return {
                start: [
                    0, 1
                ],
                end: [
                    lastExpressionEditorCoords.start[0],
                    lastExpressionEditorCoords.start[1]
                ]
            };
        }

        function buildFunctionBody(selectedLines, ast) {
            const lastExpression = selectionExpressionHelper.getLastIndependentExpression(ast);

            const lastExpressionEditorCoords = getLastExpressionEditorCoords(lastExpression);
            const bodyStartEditorCoords = buildBodyStartEditorCoords(lastExpressionEditorCoords);

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

        function getLastIndex(value) {
            return value.length - 1;
        }

        function cleanAndWrapSelection(selectedLines) {
            let selection = selectedLines.join('\n').trim();
            let lastIndex = getLastIndex(selection);

            while(selection.charAt(lastIndex) === ';') {
                selection = selection.substring(0, lastIndex);
                lastIndex = getLastIndex(selection);
            }

            return `(${selection})`.split('\n');
        }

        function tryParseSelection(selectedLines) {
            const cleanedSelection = cleanAndWrapSelection(selectedLines);
                const wrappedSelection = cleanedSelection;

                return {
                    ast: parser.tryParseSourceLines(wrappedSelection),
                    wrappedSelection: wrappedSelection
                };
        }

        function buildInitialExtractMethodContext(selectedLines) {
            let body;

            try {
                const { ast, isRawSelection, wrappedSelection } = tryParseSelection(selectedLines);

                body = buildFunctionBody(wrappedSelection, ast);
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
            const scopePath = extractHelper.getMethodScopePath(selectionEditorCoords, ast);

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