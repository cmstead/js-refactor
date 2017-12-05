'use strict';

var j = require('jfp');

function extractVariableFactory(
    coordsHelper,
    editActionsFactory,
    logger,
    parser,
    scopePathHelper,
    scopePathTools,
    selectionExpressionHelper,
    selectionHelper,
    selectionVariableHelper,
    templateHelper,
    utilities,
    vsCodeFactory
) {

    return function (_, callback) {

        function getSelectionEditorCoords(activeEditor) {
            const firstSelectionCoords = utilities.getAllSelectionCoords(activeEditor)[0];
            return coordsHelper.coordsFromDocumentToEditor(firstSelectionCoords);
        }

        function buildInitialExtractVariableContext(selectedLines) {
            return {
                variableType: 'const',
                body: selectedLines.join('\n')
            }
        }

        function isObjectScope(selectedScope) {
            return selectedScope.type.toLowerCase().indexOf('object') > -1;
        }

        function isProgramScope(selectedScope) {
            return selectedScope.type.toLowerCase().indexOf('Program') > -1;
        }

        function getExtractionLocation(scopePath, selectedOptionIndex) {
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
            } else if(isLocalScope && isFunctionScope) {
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

        function buildScopePathString(scopeNode, index) {
            return `${index}: ${scopeNode.type} - ${scopeNode.initialLine}`;
        }

        function getScopeSelectionOptions(scopePath, sourceLines) {
            return scopePathTools
                .getInitialLineData(scopePath, sourceLines)
                .map(buildScopePathString)
        }

        function getScopeQuickPick(scopePath, sourceLines, callback) {
            const items = getScopeSelectionOptions(scopePath, sourceLines);
            const quickPickOptions = {
                message: 'Select method extraction scope:'
            }

            logger.quickPick(items, quickPickOptions, callback);
        }

        function getScopePath(coords, ast) {
            const astCoords = coordsHelper.coordsFromEditorToAst(coords);

            return scopePathHelper.buildScopePath(astCoords, ast);
        }

        function getVariableType(callback) {
            const variableTypes = ['const', 'let', 'var'];

            const quickPickOptions = {
                message: 'Select method extraction scope:'
            }

            logger.quickPick(variableTypes, quickPickOptions, callback);
        }

        function getSelectedScopeIndex(selectedOption) {
            return typeof selectedOption === 'string'
                ? parseInt(selectedOption.split(':')[0])
                : 0;
        }

        function buildVariableString(context, selectedScope) {
            const variableTemplateKey = isObjectScope(selectedScope) ? 'property' : 'variable';
            const variableString = templateHelper.templates[variableTemplateKey].build(context);

            return '\n' + variableString + '\n';
        }

        function getAdjustedEditorCoords(selectionLines, editorCoords) {
            const lastIndex = selectionLines.length - 1;
            const lineLength = selectionLines[lastIndex].length;
            const hasSemicolon = selectionLines[lastIndex][lineLength - 1] === ';';

            if(hasSemicolon) {
                editorCoords.end[1] = editorCoords.end[1] - 1;
            }

            return hasSemicolon ?
                {
                    start: editorCoords.start,
                    end: [editorCoords.end[0], editorCoords.end[1] -1]
                } : editorCoords;
        }

        function getSelectionExpression (editorCoords, ast) {
            const astCoords = coordsHelper.coordsFromEditorToAst(editorCoords);
            
            if(selectionHelper.isMultilineSelection(editorCoords)) {
                return selectionExpressionHelper.getSelectionExpression(astCoords, ast);
            } else {
                return {
                    loc: astCoords
                };
            }
        }

        return function () {
            const activeEditor = vsCodeFactory.get().window.activeTextEditor;
            const tempSelectionEditorCoords = getSelectionEditorCoords(activeEditor);
            const sourceLines = utilities.getDocumentLines(activeEditor);

            const selectionLines = selectionHelper.getSelection(sourceLines, tempSelectionEditorCoords);
            const selectionEditorCoords = getAdjustedEditorCoords(selectionLines, tempSelectionEditorCoords);

            const ast = parser.parseSourceLines(sourceLines);

            const selectionExpression = getSelectionExpression(selectionEditorCoords, ast);

            if (selectionHelper.isEmptySelection(selectionEditorCoords)) {
                logger.info('Cannot extract empty selection as a variable');
            } else if (selectionExpression === null) {
                logger.info('Cannot extract a selection which is an incomplete expression');
            } else {
                const scopePath = getScopePath(selectionEditorCoords, ast);
                const selectedLines = selectionHelper.getSelection(sourceLines, selectionEditorCoords);

                const extractVariableContext = buildInitialExtractVariableContext(selectedLines);

                getScopeQuickPick(scopePath, sourceLines, function (selectedOption) {
                    const selectedOptionIndex = getSelectedScopeIndex(selectedOption);
                    const selectedScope = scopePath[selectedOptionIndex];

                    function extractVariable(variableType) {
                        extractVariableContext.type = variableType;

                        const options = {
                            prompt: 'Name of new variable'
                        };

                        logger.input(options, function (variableName) {
                            extractVariableContext.selectedOptionIndex = selectedOptionIndex;
                            extractVariableContext.name = variableName;

                            const variableString = buildVariableString(extractVariableContext, selectedScope);

                            const newMethodLocation = getExtractionLocation(scopePath, selectedOptionIndex, selectionEditorCoords);
                            const editActions = editActionsFactory(activeEditor);

                            editActions.applySetEdit(variableName, selectionEditorCoords).then(function () {
                                editActions.applySetEdit(variableString, newMethodLocation).then(callback);
                            });
                        })
                    }

                    if (isObjectScope(selectedScope)) {
                        extractVariable('');
                    } else {
                        getVariableType(extractVariable);
                    }
                });
            }
        };

    }
}

module.exports = extractVariableFactory;
