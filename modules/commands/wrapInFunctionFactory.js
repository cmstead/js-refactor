'use strict';

function wrapInFunctionFactory(
    extensionHelper,
    wrapInTemplateFactory,
    wrapInTemplateAction) {

    return function (_, callback) {
        
        function wrapSelection(selection, functionName) {
            var templates = ['function'];
            var contextExtension = { name: extensionHelper.cleanFunctionName(functionName) };
    
            return wrapInTemplateAction.wrapSelection(templates, selection, contextExtension);
        }

        return function wrapInCondition() {
            var errorMessage = 'Cannot wrap empty selection. To create a new function, use the function (fn) snippet.';
            var prompt = {prompt: 'Name of your function'};

            wrapInTemplateFactory(null, callback)(wrapSelection, errorMessage, prompt);
        }

    }
}

module.exports = wrapInFunctionFactory;