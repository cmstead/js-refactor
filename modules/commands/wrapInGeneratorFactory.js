'use strict';

function wrapInGeneratorFactory(
    wrapInGeneratorAction,
    wrapInTemplateFactory) {

    return function (vsEditor, callback) {

        return function wrapInGenerator() {
            var wrapSelection = wrapInGeneratorAction.wrapSelection;
            var errorMessage = 'Cannot wrap empty selection. To create a new generator, use the generator snippet.';
            var prompt = {prompt: 'Name of your function'};

            wrapInTemplateFactory(vsEditor, callback)(wrapSelection, errorMessage, prompt);
        }

    }
}

module.exports = wrapInGeneratorFactory;