'use strict';

function wrapInTemplateFactory(
    coordsHelper,
    editActionsFactory,
    logger,
    selectionCoordsHelper,
    selectionHelper,
    utilities,
    vsCodeFactory) {

    return function (callback) {

        function promptAndCall(callback, prompt) {
            if (prompt) {
                logger.input(prompt, callback);
            } else {
                callback();
            }
        }

        return function wrapInCondition(wrapSelection, errorMessage, prompt) {
            const activeEditor = vsCodeFactory.get().window.activeTextEditor;
            const editActions = editActionsFactory(activeEditor);

            const selectionEditorCoords = selectionCoordsHelper.getSelectionEditorCoords(activeEditor);
            const sourceLines = utilities.getDocumentLines(activeEditor);

            function applyToDocument(value) {
                const selection = selectionHelper.getSelection(sourceLines, selectionEditorCoords);
                const text = wrapSelection(selection, value);

                return editActions.applySetEdit(text, selectionEditorCoords).then(callback);
            }

            if (selectionHelper.isEmptySelection(selectionEditorCoords)) {
                logger.info(errorMessage);
            } else {
                promptAndCall(applyToDocument, prompt);
            }
        }

    }
}

module.exports = wrapInTemplateFactory;