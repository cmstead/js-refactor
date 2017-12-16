'use strict';

function commandDefFactory() {
    return function (container) {
        var vscode = container.build('vsCodeFactory').get();

        var formatDocument = vscode.commands.executeCommand.bind(vscode.commands, "editor.action.formatDocument");

        return [
            {
                name: 'cmstead.jsRefactor.addExport',
                behavior: () => container.build('addExportFactory')(formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.convertToArrowFunction',
                behavior: () => container.build('convertToArrowFunctionFactory')(formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.convertToTemplateLiteral',
                behavior: () => container.build('convertToTemplateLiteralFactory')(formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.extractMethod',
                behavior: () => container.build('extractMethodFactory')(formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.extractVariable',
                behavior: () => container.build('extractVariableFactory')(formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.inlineVariable',
                behavior: () => container.build('inlineVariableFactory')(formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.negateExpression',
                behavior: () => container.build('negateExpressionFactory')(formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.selectRefactoring',
                behavior: () => container.build('selectRefactoringFactory')(formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.shiftParams',
                behavior: () => container.build('shiftParamsFactory')(formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.wrapInCondition',
                behavior: () => container.build('wrapInConditionFactory')(formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.wrapInFunction',
                behavior: () => container.build('wrapInFunctionFactory')(formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.wrapInIIFE',
                behavior: () => container.build('wrapInIIFEFactory')(formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.wrapInTryCatch',
                behavior: () => container.build('wrapInTryCatchFactory')(formatDocument)()
            },
            {
                name: 'cmstead.jsRefactor.wrapSelection',
                behavior: () => container.build('wrapSelectionFactory')(formatDocument)()
            }
        ];

    }

}

module.exports = commandDefFactory;