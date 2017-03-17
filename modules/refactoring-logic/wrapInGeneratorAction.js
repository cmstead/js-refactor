'use strict';

function wrapInGeneratorAction(
    extensionHelper,
    wrapInTemplateAction) {

    function wrapSelection(selection, functionName) {
        var templates = ['generator'];
        var contextExtension = { name: extensionHelper.cleanFunctionName(functionName) };

        return wrapInTemplateAction.wrapSelection(templates, selection, contextExtension);
    }

    return {
        wrapSelection: wrapSelection
    };

}

module.exports = wrapInGeneratorAction;