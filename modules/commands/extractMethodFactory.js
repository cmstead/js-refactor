'use strict';

function extractMethodFactory(
    coordsHelper,
    editActionsFactory,
    logger,
    parser,
    scopePathHelper,
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

        function getScopePath(coords, ast) {
            const astCoords = coordsHelper.coordsFromEditorToAst(coords);

            return scopePathHelper.buildScopePath(astCoords, ast);
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

        function isObjectScope(selectedScope) {
            return selectedScope.type.toLowerCase().indexOf('object') > -1;
        }

        function buildFunctionStrings(context, selectedScope) {
            const functionTemplateKey = isObjectScope(selectedScope) ? 'method' : 'function';
            const functionCallTemplateKey = isObjectScope(selectedScope) ? 'methodCall' : 'functionCall';

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

        function isProgramScope(selectedScope) {
            return selectedScope.type.toLowerCase().indexOf('Program') > -1;
        }
        
        function getNewMethodLocation(scopePath, selectedOptionIndex) {
            const selectedScope = scopePath[selectedOptionIndex];
            const nextScope = scopePath[selectedOptionIndex + 1];

            const isFunctionScope = !isProgramScope(selectedScope) && !isObjectScope(selectedScope);
            const isLocalScope = scopePath.length - 1 === selectedOptionIndex;

            let destinationEditorCoords;
            let bodyOffset = 1;

            if (!isLocalScope) {
                destinationEditorCoords = coordsHelper.coordsFromAstToEditor(nextScope.loc);
                bodyOffset = 0;
            } else if (isObjectScope(selectedScope)) {
                destinationEditorCoords = coordsHelper.coordsFromAstToEditor(selectedScope.loc);
            } else if (isLocalScope && isFunctionScope) {
                destinationEditorCoords = coordsHelper.coordsFromAstToEditor(selectedScope.body.loc);
            } else {
                destinationEditorCoords = coordsHelper.coordsFromAstToEditor(selectedScope.loc);
                bodyOffset = 0;
            }

            return {
                start: [destinationEditorCoords.start[0], destinationEditorCoords.start[1] + bodyOffset],
                end: [destinationEditorCoords.start[0], destinationEditorCoords.start[1] + bodyOffset]
            };
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
                const scopePath = getScopePath(selectionEditorCoords, ast);
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

                        const newMethodLocation = getNewMethodLocation(scopePath, selectedOptionIndex, selectionEditorCoords);
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