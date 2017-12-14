'use strict';

function selectionCoordsHelper(
    coordsHelper,
    utilities
) {
    function getSelectionEditorCoords(activeEditor) {
        const firstSelectionCoords = utilities.getAllSelectionCoords(activeEditor)[0];
        return coordsHelper.coordsFromDocumentToEditor(firstSelectionCoords);
    }

    return {
        getSelectionEditorCoords: getSelectionEditorCoords
    };
}

module.exports = selectionCoordsHelper;