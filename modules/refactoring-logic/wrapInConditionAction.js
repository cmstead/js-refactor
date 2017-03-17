'use strict';

function wrapInConditionAction(
    wrapInTemplateAction) {

    function wrapSelection(selection) {
        return wrapInTemplateAction.wrapSelection(['cond'], selection);
    }

    return {
        wrapSelection: wrapSelection
    };

}

module.exports = wrapInConditionAction;