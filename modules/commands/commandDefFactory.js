'use strict';

function commandDefFactory() {
    return function (container) {
        var vscode = container.build('vsCodeFactory').get();

        var formatDocument = vscode.commands.executeCommand.bind(vscode.commands, "editor.action.formatDocument");

        return [
            {
                name: 'cmstead.jsRefactor.addExport',
                behavior: () => container.build('addExportFactory')(null, formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.convertToArrowFunction',
                behavior: () => container.build('convertToArrowFunctionFactory')(null, formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.extractMethod',
                behavior: () => container.build('extractMethodFactory')(null, formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.extractVariable',
                behavior: () => container.build('extractVariableFactory')(null, formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.inlineVariable',
                behavior: () => container.build('inlineVariableFactory')(null, formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.negateExpression',
                behavior: () => container.build('negateExpressionFactory')(null, formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.selectRefactoring',
                behavior: () => container.build('selectRefactoringFactory')(null, formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.shiftParams',
                behavior: () => container.build('shiftParamsFactory')(null, formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.wrapInCondition',
                behavior: () => container.build('wrapInConditionFactory')(null, formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.wrapInFunction',
                behavior: () => container.build('wrapInFunctionFactory')(null, formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.wrapInIIFE',
                behavior: () => container.build('wrapInIIFEFactory')(null, formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.wrapInTryCatch',
                behavior: () => container.build('wrapInTryCatchFactory')(null, formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.wrapSelection',
                behavior: () => container.build('wrapSelectionFactory')(null, formatDocument)()
            }
        ];

    }

}

module.exports = commandDefFactory;