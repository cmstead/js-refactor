'use strict';

function vsCodeHelperFactory(
    coordsHelper,
    vscodeFactory
) {
    return function () {
        const activeEditor = vscodeFactory.get().window.activeTextEditor;

        function getActiveEditor() {
            return activeEditor;
        }

        function getSourceLines() {
            return activeEditor._documentData._lines
        }

        function getSelectionCoords() {
            const selections = activeEditor._selections;
            return coordsHelper.coordsFromDocumentToEditor(selections[0]);
        }

        return {
            getActiveEditor: getActiveEditor,
            getSelectionCoords: getSelectionCoords,
            getSourceLines: getSourceLines
        };
    };
}

module.exports = vsCodeHelperFactory;