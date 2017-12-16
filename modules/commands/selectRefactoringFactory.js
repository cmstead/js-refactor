'use strict';


function selectRefactoringFactory(
    addExportFactory,
    convertToArrowFunctionFactory,
    convertToTemplateLiteralFactory,
    extractMethodFactory,
    extractVariableFactory,
    inlineVariableFactory,
    negateExpressionFactory,
    shiftParamsFactory,
    wrapSelectionFactory,
    logger) {

    return function (callback) {

        var refactoringBehaviors = {
            "Add Export": addExportFactory,
            "Convert to Arrow Function": convertToArrowFunctionFactory,
            "Convert to Template Literal": convertToTemplateLiteralFactory,
            "Extract Method": extractMethodFactory,
            "Extract Variable": extractVariableFactory,
            "Inline Variable": inlineVariableFactory,
            "Negate Expression": negateExpressionFactory,
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