'use strict';


function selectRefactoringFactory(
    addExportFactory,
    extractMethodFactory,
    extractVariableFactory,
    shiftParamsFactory,
    wrapSelectionFactory,
    logger) {

    return function (callback) {

        var refactoringBehaviors = {
            "Add Export": addExportFactory,
            "Extract Method": extractMethodFactory,
            "Extract Variable": extractVariableFactory,
            "Shift Params": shiftParamsFactory,
            "Wrap Selection": wrapSelectionFactory
        };

        function selectActionAndRun() {
            var items = Object.keys(refactoringBehaviors);
            var options = {
                prompt: 'Apply refactoring:'
            };

            logger.quickPick(items, options, function (value) {
                refactoringBehaviors[value](null, callback)();
            });
        }

        return selectActionAndRun;

    }

}

module.exports = selectRefactoringFactory;