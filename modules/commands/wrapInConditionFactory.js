'use strict';

function wrapInConditionFactory(
    wrapInTemplateFactory,
    wrapInTemplateAction) {

    return function (callback) {

        function wrapSelection(selection) {
            return wrapInTemplateAction.wrapSelection(['cond'], selection);
        }

        return function wrapInCondition() {
            var errorMessage = 'Cannot wrap empty selection. To create a new if block, use the if (cond) snippet.';

            wrapInTemplateFactory(null, callback)(wrapSelection, errorMessage);
        }

    }
}

module.exports = wrapInConditionFactory;