'use strict';

function wrapInTryCatchAction(
    wrapInTemplateAction) {

    function wrapSelection(selection) {
        return wrapInTemplateAction.wrapSelection(['tryCatch'], selection);
    }

    return {
        wrapSelection: wrapSelection
    };

}

module.exports = wrapInTryCatchAction;