'use strict';

function scopePathTools (
    coordsHelper,
    selectionHelper,
    typeHelper) {

    function getInitialLineObject(sourceLines) {
        return function (astNode) {
            const editorCoords = coordsHelper.coordsFromAstToEditor(astNode.loc);
            const selection = selectionHelper.getSelection(sourceLines, editorCoords);

            return {
                type: astNode.type,
                initialLine: selection[0]
            };
        };
    }

    function getInitialLineData(scopePath, sourceLines) {
        return scopePath.map(getInitialLineObject(sourceLines));
    }

    return {
        getInitialLineData: typeHelper.enforce(
            'scopePath, sourceLines => scopePathInitialLineData', 
            getInitialLineData)
    };
}

module.exports = scopePathTools;