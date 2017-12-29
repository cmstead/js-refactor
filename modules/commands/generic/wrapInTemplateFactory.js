'use strict';

function wrapInTemplateFactory(
    coordsHelper,
    editActionsFactory,
    logger,
    selectionHelper,
    vsCodeHelperFactory
) {

    return function (callback) {

        const vsCodeHelper = vsCodeHelperFactory();

        function promptAndCall(callback, prompt) {
            if (prompt) {
                logger.input(prompt, callback);
            } else {
                callback();
            }
        }

        return function wrapInCondition(wrapSelection, errorMessage, prompt) {
            const activeEditor = vsCodeHelper.getActiveEditor();
            const editActions = editActionsFactory(activeEditor);

            const selectionEditorCoords = vsCodeHelper.getSelectionCoords();
            const sourceLines = vsCodeHelper.getSourceLines();

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