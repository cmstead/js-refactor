'use strict';

function shiftParamsFactory (
    coordsHelper,
    editActionsFactory,
    logger,
    parser,
    selectionCoordsHelper,
    selectionExpressionHelper,
    selectionHelper,
    utilities,
    vsCodeFactory
) {
    
    return function (callback) {

        function first(values) {
            return values[0];
        }

        function last(values) {
            return values[values.length - 1];
        }

        function getOuterAstCoords(expressionArray) {
            return {
                start: first(expressionArray).loc.start,
                end: last(expressionArray).loc.end
            }
        }
        function buildParamValues(functionExpression, sourceLines) {
            return functionExpression.params.map(function(paramNode) {
                const paramEditorCoords = coordsHelper.coordsFromAstToEditor(paramNode.loc);
                return selectionHelper.getSelection(sourceLines, paramEditorCoords)[0];
            });
        }

        function buildShiftCountRange(paramCount) {
            let shiftRange = [1];

            for(let i = 2; i < paramCount; i++) {
                shiftRange.push(i);
            }

            return shiftRange;
        }

        function buildShiftCountValues(shiftCountRange) {
            return shiftCountRange.map(function(count) {
                return count + (count === 1 ? ' place' : ' places');
            });
        }

        function shiftLeft(params, count) {
            const trailingParams = params.slice(0, count);
            const leadingParams = params.slice(count);

            return leadingParams.concat(trailingParams).join(', ');
        }

        return function () {
            const activeEditor = vsCodeFactory.get().window.activeTextEditor;
            const selectionEditorCoords = selectionCoordsHelper.getSelectionEditorCoords(activeEditor);
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);
            const sourceLines = utilities.getDocumentLines(activeEditor);

            const ast = parser.parseSourceLines(sourceLines);
            const nearestFunctionExpression = selectionExpressionHelper.getNearestFunctionExpression(selectionAstCoords, ast);

            if(nearestFunctionExpression === null) {
                logger.info('Cannot locate function for shift params action.');
            } else {
                const editActions = editActionsFactory(activeEditor);
                const paramValues = buildParamValues(nearestFunctionExpression, sourceLines);
                const shiftDirections = ['left', 'right'];
                const shiftDirectionOptions = {
                    message: 'Direction to shift params:'
                };
                
                logger.quickPick(shiftDirections, shiftDirectionOptions, function (direction) {
                    const shiftCountRange = buildShiftCountRange(paramValues.length);
                    const shiftCountOptions = {
                        message: 'Number of places to shift function params:'
                    };

                    logger.quickPick(buildShiftCountValues(shiftCountRange), shiftCountOptions, function (shiftSelection) {
                        const shiftCount = parseInt(shiftSelection.split(' ')[0]);
                        const directedShiftCount = direction === 'left' ? shiftCount : paramValues.length - shiftCount;

                        const shiftedParams = shiftLeft(paramValues, directedShiftCount);
                        const paramsAstCoords = getOuterAstCoords(nearestFunctionExpression.params);
                        const paramsEditorCoords = coordsHelper.coordsFromAstToEditor(paramsAstCoords);

                        editActions.applySetEdit(shiftedParams, paramsEditorCoords);
                        callback();
                    });
                });
            }
        }
    }
}

module.exports = shiftParamsFactory;