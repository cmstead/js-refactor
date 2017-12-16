'use strict';

function wrapInAsyncFunctionFactory(
    wrapInTemplateFactory,
    wrapInTemplateAction) {

    return function (_, callback) {

        function wrapSelection(selection, functionName) {
            var templates = ['asyncFunction'];
            var contextExtension = { name: functionName };

            return wrapInTemplateAction.wrapSelection(templates, selection, contextExtension);
        }
        
        return function wrapInArrowFunction() {
            var errorMessage = 'Cannot wrap empty selection. To create a new async function, use the async snippet.';
            var prompt = { prompt: 'Name of your function' };

            wrapInTemplateFactory(null, callback)(wrapSelection, errorMessage, prompt);
        }

    }
}

module.exports = wrapInAsyncFunctionFactory;