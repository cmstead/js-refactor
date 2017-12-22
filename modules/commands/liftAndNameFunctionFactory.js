'use strict';

function liftAndNameFunctionFactory(
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

        function getFunctionName(callback) {
            const inputOptions = {
                prompt: 'Name of your function'
            };

            logger.input(inputOptions, callback);
        }

        const first = values => values[0];
        const last = values => values[values.length - 1];

        function getParams(functionNode, sourceLines) {
            const paramsAstCoords = {
                start: first(functionNode.params).loc.start,
                end: last(functionNode.params).loc.end
            };
            const paramsEditorCoords = coordsHelper.coordsFromAstToEditor(paramsAstCoords);

            return selectionHelper.getSelection(sourceLines, paramsEditorCoords).join('\n');
        }

        function getBody(functionNode, sourceLines) {
            const bodyAstCoords = {
                start: first(functionNode.body.body).loc.start,
                end: last(functionNode.body.body).loc.end
            };
            const bodyEditorCoords = coordsHelper.coordsFromAstToEditor(bodyAstCoords);

            return selectionHelper.getSelection(sourceLines, bodyEditorCoords).join('\n');
        }

        return function () {
            const editActions = editActionsFactory();
            const sourceLines = vsCodeHelper.getSourceLines();
            const selectionEditorCoords = vsCodeHelper.getSelectionCoords();

            const ast = parser.parseSourceLines(sourceLines);

            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);
            const selectedFunction = selectionExpressionHelper.getNearestFunctionExpression(selectionAstCoords, ast);

            if(selectedFunction === null || selectedFunction.type === 'FunctionDeclaration') {
                logger.info('Unable to locate acceptable function expression to lift and name');
            } else {
                const scopePath = scopeHelper.getScopePath(selectionEditorCoords, ast);

                scopeHelper.getScopeQuickPick(scopePath, sourceLines, function (selectedOption) {
                    getFunctionName(function(functionName) {
                        const selectedOptionIndex = scopeHelper.getSelectedScopeIndex(selectedOption);
                        const selectedFunctionEditorCoords = coordsHelper.coordsFromAstToEditor(selectedFunction.loc);
                        const newMethodLocation = extractHelper
                            .getNewExtractionLocation(scopePath, selectedOptionIndex, selectionEditorCoords, ast);
    
                        console.log(selectedFunction);

                        const functionContext = {
                            name: functionName,
                            arguments: selectedFunction.params.length > 0 
                                ? getParams(selectedFunction, sourceLines)
                                : '',
                            body: selectedFunction.body.body.length > 0
                                ? getBody(selectedFunction, sourceLines)
                                : ''
                        };
    
                        const functionString = templateHelper.templates.function.build(functionContext);
                        
                        editActions.applySetEdit(functionName, selectedFunctionEditorCoords).then(function() {
                            editActions.applySetEdit(functionString, newMethodLocation).then(callback);
                        });
                    });
                });

            }
        };
    };
}

module.exports = liftAndNameFunctionFactory;