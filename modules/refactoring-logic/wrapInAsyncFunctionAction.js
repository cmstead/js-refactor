'use strict';

function wrapInAsyncFunctionAction(
    extensionHelper,
    wrapInTemplateAction) {

    function wrapSelection(selection, functionName) {
        var templates = ['asyncFunction'];
        var contextExtension = { name: extensionHelper.cleanFunctionName(functionName) };

        return wrapInTemplateAction.wrapSelection(templates, selection, contextExtension);
    }

    return {
        wrapSelection: wrapSelection
    };

}

module.exports = wrapInAsyncFunctionAction;