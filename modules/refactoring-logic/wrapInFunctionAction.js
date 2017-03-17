'use strict';

function wrapInFunctionAction(
    extensionHelper,
    wrapInTemplateAction) {

    function wrapSelection(selection, functionName) {
        var templates = ['function'];
        var contextExtension = { name: extensionHelper.cleanFunctionName(functionName) };

        return wrapInTemplateAction.wrapSelection(templates, selection, contextExtension);
    }

    return {
        wrapSelection: wrapSelection
    };

}

module.exports = wrapInFunctionAction;