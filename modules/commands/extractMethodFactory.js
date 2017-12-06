'use strict';

function extractMethodFactory(
    coordsHelper,
    editActionsFactory,
    extractHelper,
    logger,
    parser,
    scopePathTools,
    selectionHelper,
    selectionVariableHelper,
    templateHelper,
    utilities,
    vsCodeFactory
) {


    return function (_, callback) {

        function getScopeSelectionOptions(scopePath, sourceLines) {
            return scopePathTools
                .getInitialLineData(scopePath, sourceLines)
                .map(buildScopePathString)
        }

        function getUnboundVars(coords, ast) {
            const astCoords = coordsHelper.coordsFromEditorToAst(coords);
            const unboundVars = selectionVariableHelper.getUnboundVars(astCoords, ast);
            return unboundVars.join(', ');
        }

        function buildScopePathString(scopeNode, index) {
            return `${index}: ${scopeNode.type} - ${scopeNode.initialLine}`;
        }

        function getSelectedScopeIndex(selectedOption) {
            return typeof selectedOption === 'string'
                ? parseInt(selectedOption.split(':')[0])
                : 0;
        }

        function getScopeQuickPick(scopePath, sourceLines, callback) {
            const items = getScopeSelectionOptions(scopePath, sourceLines);
            const quickPickOptions = {
                message: 'Select method extraction scope:'
            }

            logger.quickPick(items, quickPickOptions, callback);
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

        function buildInitialExtractMethodCotext(selectedLines) {
            return {
                selectedOptionIndex: 0,
                name: '',
                body: selectedLines.join('\n'),
                arguments: ''
            };
        }

        function getSelectionEditorCoords(activeEditor) {
            const firstSelectionCoords = utilities.getAllSelectionCoords(activeEditor)[0];
            return coordsHelper.coordsFromDocumentToEditor(firstSelectionCoords);
        }

        return function () {
            const activeEditor = vsCodeFactory.get().window.activeTextEditor;
            const selectionEditorCoords = getSelectionEditorCoords(activeEditor);

            const sourceLines = utilities.getDocumentLines(activeEditor);
            const selectedLines = selectionHelper.getSelection(sourceLines, selectionEditorCoords);

            const extractMethodContext = buildInitialExtractMethodCotext(selectedLines);

            if (selectionHelper.isEmptySelection(selectionEditorCoords)) {
                logger.info('Cannot extract an empty selection as a method.');
            } else {
                const ast = parser.parseSourceLines(sourceLines);
                const scopePath = extractHelper.getScopePath(selectionEditorCoords, ast);
                const unboundVars = getUnboundVars(selectionEditorCoords, ast);

                extractMethodContext.arguments = unboundVars;

                getScopeQuickPick(scopePath, sourceLines, function (selectedOption) {
                    getFunctionName(function (functionName) {
                        const selectedOptionIndex = getSelectedScopeIndex(selectedOption);
                        const selectedScope = scopePath[selectedOptionIndex];

                        extractMethodContext.selectedOptionIndex = selectedOptionIndex;
                        extractMethodContext.name = functionName;

                        const {
                            newFunction,
                            newFunctionCall
                        } = buildFunctionStrings(extractMethodContext, selectedScope);

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