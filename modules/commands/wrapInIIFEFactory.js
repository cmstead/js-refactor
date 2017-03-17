'use strict';

function wrapInIIFEFactory(
    wrapInIIFEAction,
    wrapInTemplateFactory) {

    return function (vsEditor, callback) {

        return function wrapInCondition() {
            var wrapSelection = wrapInIIFEAction.wrapSelection;
            var errorMessage = 'Cannot wrap empty selection. To create a new IIFE, use the IIFE (iife) snippet.';

            wrapInTemplateFactory(vsEditor, callback)(wrapSelection, errorMessage);
        }

    }
}

module.exports = wrapInIIFEFactory;