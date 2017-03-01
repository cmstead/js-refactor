'use strict';

function commandDefFactory(
    addExportFactory,
    convertToMemberFunctionFactory,
    convertToNamedFunctionFactory,
    extractVariableFactory,
    shiftParamsLeftFactory,
    shiftParamsRightFactory,
    wrapInExecutedFunctionFactory,
    wrapInFunctionFactory,
    wrapInIIFEFactory,
    wrapInConditionFactory
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
            name: 'cmstead.jsRefactor.shiftParamsLeft',
            behavior: shiftParamsLeftFactory
        },
        {
            name: 'cmstead.jsRefactor.shiftParamsRight',
            behavior: shiftParamsRightFactory
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
            name: 'cmstead.jsRefactor.wrapInCondition',
            behavior: wrapInConditionFactory
        }
    ];
}

commandDefFactory['@dependencies'] = [
    'addExportFactory',
    'convertToMemberFunctionFactory',
    'convertToNamedFunctionFactory',
    'extractVariableFactory',
    'shiftParamsLeftFactory',
    'shiftParamsRightFactory',
    'wrapInExecutedFunctionFactory',
    'wrapInFunctionFactory',
    'wrapInIIFEFactory',
    'wrapInConditionFactory'
]

module.exports = commandDefFactory;