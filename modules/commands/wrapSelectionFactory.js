'use strict';

function wrapSelectionFactory(
    wrapInConditionFactory,
    wrapInExecutedFunctionFactory,
    wrapInFunctionFactory,
    wrapInIIFEFactory,
    logger) {

    return function (vsCode, callback) {

        var wrapBehaviors = {
            "Condition": wrapInConditionFactory,
            "Executed Function": wrapInExecutedFunctionFactory,
            "Function": wrapInFunctionFactory,
            "IIFE": wrapInIIFEFactory
        };

        function selectActionAndRun() {
            var items = Object.keys(wrapBehaviors);
            var options = {
                prompt: 'Wrap selection in:'
            };

            logger.quickPick(items, options, function (value) {
                wrapBehaviors[value](vsCode, callback)();
            });
        }

        return selectActionAndRun;

    }

}

module.exports = wrapSelectionFactory;