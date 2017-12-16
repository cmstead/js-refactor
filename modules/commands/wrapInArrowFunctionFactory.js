'use strict';

function wrapInArrowFunctionFactory(
    wrapInTemplateFactory,
    wrapInTemplateAction) {

    return function (callback) {

        function wrapSelection(selection) {
            return wrapInTemplateAction.wrapSelection(['arrowFunction'], selection);
        }
        
        return function wrapInArrowFunction() {
            var errorMessage = 'Cannot wrap empty selection. To create a new arrow function, use the arrow or lambda snippet.';

            wrapInTemplateFactory(null, callback)(wrapSelection, errorMessage);
        }

    }
}

module.exports = wrapInArrowFunctionFactory;