'use strict';

function wrapInIIFEFactory(
    wrapInTemplateFactory,
    wrapInTemplateAction) {

    return function (_, callback) {

        function wrapSelection(selection) {
            return wrapInTemplateAction.wrapSelection(['iife'], selection);
        }

        return function wrapInCondition() {
            var errorMessage = 'Cannot wrap empty selection. To create a new IIFE, use the IIFE (iife) snippet.';

            wrapInTemplateFactory(null, callback)(wrapSelection, errorMessage);
        }

    }
}

module.exports = wrapInIIFEFactory;