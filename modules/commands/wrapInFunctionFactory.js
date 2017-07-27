'use strict';

function wrapInFunctionFactory(
    wrapInFunctionAction,
    wrapInTemplateFactory) {

    return function (_, callback) {

        return function wrapInCondition() {
            var wrapSelection = wrapInFunctionAction.wrapSelection;
            var errorMessage = 'Cannot wrap empty selection. To create a new function, use the function (fn) snippet.';
            var prompt = {prompt: 'Name of your function'};

            wrapInTemplateFactory(null, callback)(wrapSelection, errorMessage, prompt);
        }

    }
}

module.exports = wrapInFunctionFactory;