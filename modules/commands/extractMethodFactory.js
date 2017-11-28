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

        function getScopePath(coords, sourceLines) {
            const ast = parser.parseSourceLines(sourceLines);
            const astCoords = coordsHelper.coordsFromEditorToAst(coords);

            return scopePathHelper.buildScopePath(astCoords, ast);
        }

        return function () {
            const activeEditor = vsCodeFactory.get().window.activeTextEditor;
            
            const lines = utilities.getDocumentLines(activeEditor);
            const allSelectionCoords = utilities.getAllSelectionCoords(activeEditor);

            const coords = coordsHelper.coordsFromDocumentToEditor(allSelectionCoords[0]);
            const scopePath = getScopePath(coords, lines);

            
            if(selectionHelper.isEmptySelection(coords)) {
                logger.info('Cannot extract an empty selection as a method.');
                callback();
            } else {

                logger.info('Extract method development is still underway.');
                // stuff here
                callback();
            }

        }
    }

}

module.exports = extractMethodFactory;