'use strict';

function wrapInGeneratorFactory(
    wrapInTemplateFactory,
    wrapInTemplateAction) {

    return function (_, callback) {

        function wrapSelection(selection, functionName) {
            var templates = ['generator'];
            var contextExtension = { name: functionName };

            return wrapInTemplateAction.wrapSelection(templates, selection, contextExtension);
        }

        return function wrapInGenerator() {
            var errorMessage = 'Cannot wrap empty selection. To create a new generator, use the generator snippet.';
            var prompt = { prompt: 'Name of your function' };

            wrapInTemplateFactory(null, callback)(wrapSelection, errorMessage, prompt);
        }

    }
}

module.exports = wrapInGeneratorFactory;