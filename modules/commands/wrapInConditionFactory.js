'use strict';

function wrapInConditionFactory(
    wrapInConditionAction,
    wrapInTemplateFactory) {

    return function (vsEditor, callback) {

        return function wrapInCondition() {
            var wrapSelection = wrapInConditionAction.wrapSelection;
            var errorMessage = 'Cannot wrap empty selection. To create a new if block, use the if (cond) snippet.';

            wrapInTemplateFactory(vsEditor, callback)(wrapSelection, errorMessage);
        }

    }
}

module.exports = wrapInConditionFactory;