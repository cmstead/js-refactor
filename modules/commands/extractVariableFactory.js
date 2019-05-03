'use strict';

function extractVariableFactory(
    coordsHelper,
    editActionsFactory,
    extractHelper,
    logger,
    parser,
    scopeHelper,
    selectionExpressionHelper,
    selectionHelper,
    templateHelper,
    vsCodeHelperFactory
) {

    return function (callback) {
        const vsCodeHelper = vsCodeHelperFactory();

        function buildInitialExtractVariableContext(selectedLines) {
            return {
                variableType: 'const',
                body: selectedLines.join('\n')
            }
        }

        function getVariableType(callback) {
            const variableTypes = ['const', 'let', 'var'];

            const quickPickOptions = {
                placeHolder: 'Select variable type:'
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

        function applyVariableExtraction(selectionEditorCoords, ast, sourceLines) {
            const activeEditor = vsCodeHelper.getActiveEditor();
            
            const scopePath = extractHelper.getScopePath(selectionEditorCoords, ast);
            const selectedLines = selectionHelper.getSelection(sourceLines, selectionEditorCoords);
            const extractVariableContext = buildInitialExtractVariableContext(selectedLines);

            scopeHelper.getScopeQuickPick(scopePath, sourceLines, function (selectedOption) {
                const selectedOptionIndex = scopeHelper.getSelectedScopeIndex(selectedOption);
                const selectedScope = scopePath[selectedOptionIndex];

                const newMethodLocation = extractHelper
                    .getNewExtractionLocation(scopePath, selectedOptionIndex, selectionEditorCoords, ast);

                console.log(newMethodLocation);

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
            const tempSelectionEditorCoords = vsCodeHelper.getSelectionCoords();
            const sourceLines = vsCodeHelper.getSourceLines();

            const selectionLines = selectionHelper.getSelection(sourceLines, tempSelectionEditorCoords);
            const selectionEditorCoords = getAdjustedEditorCoords(selectionLines, tempSelectionEditorCoords);

            const ast = parser.parseSourceLines(sourceLines);

            const selectionExpression = getSelectionExpression(selectionEditorCoords, ast);

            if (selectionHelper.isEmptySelection(selectionEditorCoords)) {
                logger.info('Cannot extract empty selection as a variable');
            } else if (selectionExpression === null) {
                logger.info('Cannot extract a selection which is an incomplete expression');
            } else {
                applyVariableExtraction(selectionEditorCoords, ast, sourceLines)
            }
        };

    }
}

module.exports = extractVariableFactory;
