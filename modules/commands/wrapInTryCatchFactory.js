'use strict';

function wrapInTryCatchFactory(
    wrapInTryCatchAction,
    wrapInTemplateFactory) {

    return function (vsEditor, callback) {

        return function wrapInTryCatch() {
            var wrapSelection = wrapInTryCatchAction.wrapSelection;
            var errorMessage = 'Cannot wrap empty selection. To create a new try/catch block, use the tryCatch snippet.';

            wrapInTemplateFactory(vsEditor, callback)(wrapSelection, errorMessage);
        }

    }
}

module.exports = wrapInTryCatchFactory;