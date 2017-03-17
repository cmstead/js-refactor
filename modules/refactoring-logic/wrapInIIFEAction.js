'use strict';

function wrapInIIFEAction(
    wrapInTemplateAction) {

    function wrapSelection(selection) {
        return wrapInTemplateAction.wrapSelection(['iife'], selection);
    }

    return {
        wrapSelection: wrapSelection
    };

}

module.exports = wrapInIIFEAction;