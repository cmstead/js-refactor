'use strict';

function wrapInTryCatchFactory(
    wrapInTemplateFactory,
    wrapInTemplateAction) {

    return function (callback) {

        function wrapSelection(selection) {
            return wrapInTemplateAction.wrapSelection(['tryCatch'], selection);
        }

        return function wrapInTryCatch() {
            var errorMessage = 'Cannot wrap empty selection. To create a new try/catch block, use the tryCatch snippet.';

            wrapInTemplateFactory(null, callback)(wrapSelection, errorMessage);
        }

    }
}

module.exports = wrapInTryCatchFactory;