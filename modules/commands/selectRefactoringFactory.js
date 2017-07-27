'use strict';


function selectRefactoringFactory(
    addExportFactory,
    convertToMemberFunctionFactory,
    convertToNamedFunctionFactory,
    extractVariableFactory,
    shiftParamsLeftFactory,
    shiftParamsRightFactory,
    wrapSelectionFactory,
    logger) {

    return function (_, callback) {

        var refactoringBehaviors = {
            "Add Export": addExportFactory,
            "Convert to Member Function": convertToMemberFunctionFactory,
            "Convert to Named Function": convertToNamedFunctionFactory,
            "extractVariableFactory": extractVariableFactory,
            "Shift Params Left": shiftParamsLeftFactory,
            "Shift Params Right": shiftParamsRightFactory,
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