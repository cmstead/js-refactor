'use strict';

function extractVariableFactory(
    coordsHelper,
    editActionsFactory,
    extractHelper,
    logger,
    parser,
    scopeHelper,
    scopePathHelper,
    scopePathTools,
    selectionCoordsHelper,
    selectionExpressionHelper,
    selectionHelper,
    selectionVariableHelper,
    templateHelper,
    utilities,
    vsCodeFactory
) {

    return function (_, callback) {

        function buildInitialExtractVariableContext(selectedLines) {
            return {
                variableType: 'const',
                body: selectedLines.join('\n')
            }
        }

        function getVariableType(callback) {
            const variableTypes = ['const', 'let', 'var'];

            const quickPickOptions = {
                message: 'Select method extraction scope:'
            }

            logger.quickPick(variableTypes, quickPickOptions, callback);
        }

        function buildVariableString(context, selectedScope) {
            const variableTemplateKey = extractHelper.isObjectScope(selectedScope) ? 'property' : 'variable';
            const variableString = templateHelper.templates[variableTemplateKey].build(context);

            return variableString + '\n';
        }

        function buildVariableRef(selectedScope, variableName) {
            return extractHelper.isObjectScope(selectedScope) ? 'this.' + variableName : variableName
        }

        function getAdjustedEditorCoords(selectionLines, editorCoords) {
            const lastIndex = selectionLines.length - 1;
            const lineLength = selectionLines[lastIndex].length;
            const hasSemicolon = selectionLines[lastIndex][lineLength - 1] === ';';

            if (hasSemicolon) {
                editorCoords.end[1] = editorCoords.end[1] - 1;
            }

            return hasSemicolon ?
                {
                    start: editorCoords.start,
                    end: [editorCoords.end[0], editorCoords.end[1] - 1]
                } : editorCoords;
        }

        function getSelectionExpression(editorCoords, ast) {
            const astCoords = coordsHelper.coordsFromEditorToAst(editorCoords);

            if (selectionHelper.isMultilineSelection(editorCoords)) {
                return selectionExpressionHelper.getSelectionExpression(astCoords, ast);
            } else {
                return {
                    loc: astCoords
                };
            }
        }

        function applyVariableExtraction(selectionEditorCoords, ast, sourceLines, activeEditor) {
            const scopePath = scopeHelper.getScopePath(selectionEditorCoords, ast);
            const selectedLines = selectionHelper.getSelection(sourceLines, selectionEditorCoords);
            const extractVariableContext = buildInitialExtractVariableContext(selectedLines);

            scopeHelper.getScopeQuickPick(scopePath, sourceLines, function (selectedOption) {
                const selectedOptionIndex = scopeHelper.getSelectedScopeIndex(selectedOption);
                const selectedScope = scopePath[selectedOptionIndex];

                const newMethodLocation = extractHelper
                    .getNewExtractionLocation(scopePath, selectedOptionIndex, selectionEditorCoords, ast);

                function applyExtractEdit(variableType) {
                    return function (variableName) {
                        extractVariableContext.type = variableType;
                        extractVariableContext.name = variableName;

                        const variableString = buildVariableString(extractVariableContext, selectedScope);
                        const editActions = editActionsFactory(activeEditor);
                        const variableRef = buildVariableRef(selectedScope, variableName);

                        editActions.applySetEdit(variableRef, selectionEditorCoords).then(function () {
                            editActions.applySetEdit(variableString, newMethodLocation).then(callback);
                        });

                    }
                }

                function extractVariable(variableType) {
                    const options = { prompt: 'Name of new variable' };

                    logger.input(options, applyExtractEdit(variableType))
                }

                if (extractHelper.isObjectScope(selectedScope)) {
                    extractVariable('');
                } else {
                    getVariableType(extractVariable);
                }
            });
        }

        return function () {
            const activeEditor = vsCodeFactory.get().window.activeTextEditor;
            const tempSelectionEditorCoords = selectionCoordsHelper.getSelectionEditorCoords(activeEditor);
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
                applyVariableExtraction(selectionEditorCoords, ast, sourceLines, activeEditor)
            }
        };

    }
}

module.exports = extractVariableFactory;
