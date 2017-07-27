'use strict';

function wrapInIIFEFactory(
    wrapInIIFEAction,
    wrapInTemplateFactory) {

    return function (_, callback) {

        return function wrapInCondition() {
            var wrapSelection = wrapInIIFEAction.wrapSelection;
            var errorMessage = 'Cannot wrap empty selection. To create a new IIFE, use the IIFE (iife) snippet.';

            wrapInTemplateFactory(null, callback)(wrapSelection, errorMessage);
        }

    }
}

module.exports = wrapInIIFEFactory;