'use strict';

function commandDefFactory(
    addExportFactory,
    convertToMemberFunctionFactory,
    convertToNamedFunctionFactory,
    extractVariableFactory,
    inlineVariableFactory,
    negateExpressionFactory,
    selectRefactoringFactory,
    shiftParamsLeftFactory,
    shiftParamsRightFactory,
    wrapInConditionFactory,
    wrapInExecutedFunctionFactory,
    wrapInFunctionFactory,
    wrapInIIFEFactory,
    wrapSelectionFactory,
    wrapInTryCatchFactory
) {

    return [
        {
            name: 'cmstead.jsRefactor.exportFunction',
            behavior: addExportFactory
        },
        {
            name: 'cmstead.jsRefactor.convertToMemberFunction',
            behavior: convertToMemberFunctionFactory
        },
        {
            name: 'cmstead.jsRefactor.convertToNamedFunction',
            behavior: convertToNamedFunctionFactory
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
            name: 'cmstead.jsRefactor.wrapInExecutedFunction',
            behavior: wrapInExecutedFunctionFactory
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