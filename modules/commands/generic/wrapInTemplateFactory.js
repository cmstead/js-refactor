'use strict';

function wrapInTemplateFactory(
    logger,
    selectionFactory,
    utilities,
    editActionsFactory) {

    return function (vsEditor, callback) {

        function promptAndCall(callback, prompt) {
            if (prompt) {
                logger.input(prompt, callback);
            } else {
                callback();
            }
        }

        return function wrapInCondition(wrapSelection, errorMessage, prompt) {
            var selection = selectionFactory(vsEditor).getSelection(0);

            function applyToDocument(value) {
                var text = wrapSelection(selection, value);
                var coords = utilities.buildCoords(vsEditor, 0);

                return editActionsFactory(vsEditor).applySetEdit(text, coords).then(callback);
            }

            if (selection === null) {
                logger.info(errorMessage);
            } else {
                promptAndCall(applyToDocument, prompt);
            }
        }

    }
}

module.exports = wrapInTemplateFactory;