'use strict';

function wrapInExecutedFunctionAction(
    extensionHelper,
    wrapInTemplateAction) {

    function wrapSelection(selection, functionName) {
        var templates = ['function', 'functionCall'];
        var contextExtension = { name: extensionHelper.cleanFunctionName(functionName) };

        return wrapInTemplateAction.wrapSelection(templates, selection, contextExtension);
    }

    return {
        wrapSelection: wrapSelection
    };

}

module.exports = wrapInExecutedFunctionAction;