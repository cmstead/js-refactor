'use strict';

function extractMethodFactory(
    coordsHelper,
    editActionsFactory,
    extractHelper,
    logger,
    parser,
    scopeHelper,
    selectionCoordsHelper,
    selectionHelper,
    selectionVariableHelper,
    templateHelper,
    utilities,
    vsCodeFactory
) {


    return function (_, callback) {

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

        function buildInitialExtractMethodContext(selectedLines) {
            return {
                selectedOptionIndex: 0,
                name: '',
                body: selectedLines.join('\n'),
                arguments: ''
            };
        }

        return function () {
            const activeEditor = vsCodeFactory.get().window.activeTextEditor;
            const selectionEditorCoords = selectionCoordsHelper.getSelectionEditorCoords(activeEditor);

            const sourceLines = utilities.getDocumentLines(activeEditor);
            const selectedLines = selectionHelper.getSelection(sourceLines, selectionEditorCoords);

            const extractMethodContext = buildInitialExtractMethodContext(selectedLines);

            if (selectionHelper.isEmptySelection(selectionEditorCoords)) {
                logger.info('Cannot extract an empty selection as a method.');
            } else {
                const ast = parser.parseSourceLines(sourceLines);
                const scopePath = extractHelper.getScopePath(selectionEditorCoords, ast);

                scopeHelper.getScopeQuickPick(scopePath, sourceLines, function (selectedOption) {
                    getFunctionName(function (functionName) {
                        const selectedOptionIndex = scopeHelper.getSelectedScopeIndex(selectedOption);
                        const destinationScope = scopePath[selectedOptionIndex];

                        const unboundVars = getUnboundVars(selectionEditorCoords, destinationScope.loc, ast);

                        extractMethodContext.arguments = unboundVars;

                        extractMethodContext.selectedOptionIndex = selectedOptionIndex;
                        extractMethodContext.name = functionName;

                        const {
                            newFunction,
                            newFunctionCall
                        } = buildFunctionStrings(extractMethodContext, destinationScope);

                        const newMethodLocation = extractHelper
                            .getNewExtractionLocation(
                            scopePath,
                            selectedOptionIndex,
                            selectionEditorCoords,
                            ast
                            );
                        const editActions = editActionsFactory(activeEditor);

                        editActions.applySetEdit(newFunctionCall, selectionEditorCoords).then(function () {
                            editActions.applySetEdit(newFunction, newMethodLocation).then(callback);
                        });
                    });
                });

            }

        }
    }

}

module.exports = extractMethodFactory;