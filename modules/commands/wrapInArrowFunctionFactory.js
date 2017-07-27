'use strict';

function wrapInArrowFunctionFactory(
    wrapInArrowFunctionAction,
    wrapInTemplateFactory) {

    return function (_, callback) {

        return function wrapInArrowFunction() {
            var wrapSelection = wrapInArrowFunctionAction.wrapSelection;
            var errorMessage = 'Cannot wrap empty selection. To create a new arrow function, use the arrow or lambda snippet.';

            wrapInTemplateFactory(null, callback)(wrapSelection, errorMessage);
        }

    }
}

module.exports = wrapInArrowFunctionFactory;