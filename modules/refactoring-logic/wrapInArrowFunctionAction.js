'use strict';

function wrapInArrowFunctionAction(
    wrapInTemplateAction) {

    function wrapSelection(selection) {
        return wrapInTemplateAction.wrapSelection(['arrowFunction'], selection);
    }

    return {
        wrapSelection: wrapSelection
    };

}

module.exports = wrapInArrowFunctionAction;