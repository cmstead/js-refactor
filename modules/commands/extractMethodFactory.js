'use strict';

function extractMethodFactory(
    coordsHelper,
    logger,
    parser,
    scopePathHelper,
    scopePathTools,
    selectionHelper,
    utilities,
    vsCodeFactory
) {


    return function(_, callback) {

        function getScopeSelectionOptions (scopePath, sourceLines) {
            return scopePathTools
                .getInitialLineData(scopePath, sourceLines)
                .map(buildScopePathString)
        }

        function getScopePath(coords, sourceLines) {
            const ast = parser.parseSourceLines(sourceLines);
            const astCoords = coordsHelper.coordsFromEditorToAst(coords);

            return scopePathHelper.buildScopePath(astCoords, ast);
        }

        function buildScopePathString(scopeNode, index) {
            return `${index}: ${scopeNode.type} - ${scopeNode.initialLine}`;
        }

        return function () {
            const activeEditor = vsCodeFactory.get().window.activeTextEditor;
            
            const sourceLines = utilities.getDocumentLines(activeEditor);
            const allSelectionCoords = utilities.getAllSelectionCoords(activeEditor);

            const coords = coordsHelper.coordsFromDocumentToEditor(allSelectionCoords[0]);
            
            
            if(selectionHelper.isEmptySelection(coords)) {
                logger.info('Cannot extract an empty selection as a method.');
                callback();
            } else {
                const scopePath = getScopePath(coords, sourceLines);

                const items = getScopeSelectionOptions(scopePath, sourceLines);
                const quickPickOptions = {
                    message: 'Select method extraction scope:'
                }

                logger.quickPick(items, quickPickOptions, function () {
                    callback();
                });
            }

        }
    }

}

module.exports = extractMethodFactory;