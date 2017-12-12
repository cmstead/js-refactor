'use strict';

function commandDefFactory(
    addExportFactory,
    convertToArrowFunctionFactory,
    extractMethodFactory,
    extractVariableFactory,
    inlineVariableFactory,
    negateExpressionFactory,
    selectRefactoringFactory,
    shiftParamsLeftFactory,
    shiftParamsRightFactory,
    wrapInConditionFactory,
    wrapInFunctionFactory,
    wrapInIIFEFactory,
    wrapSelectionFactory,
    wrapInTryCatchFactory
) {

    return [
        {
            name: 'cmstead.jsRefactor.addExport',
            behavior: addExportFactory
        },
        {
            name: 'cmstead.jsRefactor.convertToArrowFunction',
            behavior: convertToArrowFunctionFactory
        },
        {
            name: 'cmstead.jsRefactor.extractMethod',
            behavior: extractMethodFactory
        },
        {
            name: 'cmstead.jsRefactor.extractVariable',
            behavior: extractVariableFactory
        },
        {
            name: 'cmstead.jsRefactor.inlineVariable',
            behavior: inlineVariableFactory
        },
        {
            name: 'cmstead.jsRefactor.negateExpression',
            behavior: negateExpressionFactory
        },
        {
            name: 'cmstead.jsRefactor.selectRefactoring',
            behavior: selectRefactoringFactory
        },
        {
            name: 'cmstead.jsRefactor.shiftParamsLeft',
            behavior: shiftParamsLeftFactory
        },
        {
            name: 'cmstead.jsRefactor.shiftParamsRight',
            behavior: shiftParamsRightFactory
        },
        {
            name: 'cmstead.jsRefactor.wrapInCondition',
            behavior: wrapInConditionFactory
        },
        {
            name: 'cmstead.jsRefactor.wrapInFunction',
            behavior: wrapInFunctionFactory
        },
        {
            name: 'cmstead.jsRefactor.wrapInIIFE',
            behavior: wrapInIIFEFactory
        },
        {
            name: 'cmstead.jsRefactor.wrapInTryCatch',
            behavior: wrapInTryCatchFactory
        },
        {
            name: 'cmstead.jsRefactor.wrapSelection',
            behavior: wrapSelectionFactory
        }
    ];
}

module.exports = commandDefFactory;