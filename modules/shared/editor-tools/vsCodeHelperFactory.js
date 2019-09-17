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

        function getLanguageId() {
            return activeEditor._documentData._languageId;
        }

        function getFilePath() {
            return activeEditor._documentData._uri.fsPath;
        }

        function getFileExtension() {
            return getFilePath().split('.').pop();
        }

        function getSelectionCoords() {
            const selections = activeEditor._selections;
            return coordsHelper.coordsFromDocumentToEditor(selections[0]);
        }

        return {
            getActiveEditor: getActiveEditor,
            getFileExtension: getFileExtension,
            getFilePath: getFilePath,
            getLanguageId: getLanguageId,
            getSelectionCoords: getSelectionCoords,
            getSourceLines: getSourceLines
        };
    };
}

module.exports = vsCodeHelperFactory;