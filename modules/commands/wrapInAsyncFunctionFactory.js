'use strict';

function wrapInAsyncFunctionFactory(
    wrapInAsyncFunctionAction,
    wrapInTemplateFactory) {

    return function (vsEditor, callback) {

        return function wrapInArrowFunction() {
            var wrapSelection = wrapInAsyncFunctionAction.wrapSelection;
            var errorMessage = 'Cannot wrap empty selection. To create a new async function, use the async snippet.';
            var prompt = {prompt: 'Name of your function'};

            wrapInTemplateFactory(vsEditor, callback)(wrapSelection, errorMessage, prompt);
        }

    }
}

module.exports = wrapInAsyncFunctionFactory;