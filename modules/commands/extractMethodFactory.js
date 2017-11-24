'use strict';

function extractMethodFactory(
    coordsHelper,
    logger,
    parser,
    scopePathHelper,
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
            const vsEditor = vsCodeFactory.get().window.activeTextEditor;
            const lines = utilities.getEditorDocument(vsEditor)._lines;
            const coords = utilities.buildCoords(vsEditor, 0);

            const selectionNotEmpty = coords.start[0] !== coords.end[0] || coords.start[1] !== coords.end[1];
            const scopePath = selectionNotEmpty
                ? getScopePath(coords, lines)
                : [];
            
            if(scopePath.length === 0) {
                logger.error('Cannot extract an empty selection.');
                callback();
            } else {
                // stuff here
            }

        }
    }

}

module.exports = extractMethodFactory;