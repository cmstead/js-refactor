'use strict';

function selectRefactoringFactory(
    coordsHelper,
    logger,
    parser,
    scopeHelper,
    vsCodeHelperFactory
) {
    
    return function (callback) {
        const container = require('../../container');
        const vsCodeHelper = vsCodeHelperFactory();
        
        const commandActionData = require('../json/commandActionData');
        const refactoringKeys = Object
            .keys(commandActionData)
            .filter(key => !commandActionData[key].excludeFromSelectList)
            .reduce(function (result, key) {
                const description = commandActionData[key].description;
                const command = commandActionData[key].command;

                result[description] = command;
                return result;
            }, {});

        function selectActionAndRun() {
            const activeEditor = vsCodeHelper.getActiveEditor();
            const sourceLines = vsCodeHelper.getSourceLines();
            const ast = parser.parseSourceLines(sourceLines);

            const selectionEditorCoords = vsCodeHelper.getSelectedCoords();
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const getExpressionPath = scopeHelper.getExpressionPath(selectionAstCoords, ast);

            var items = Object.keys(refactoringKeys);
            var options = {
                prompt: 'Apply refactoring:'
            };

            logger.quickPick(items, options, function (value) {
                const refactoringKey = refactoringKeys[value];
                container.build(refactoringKey)(callback)();
            });
        }

        return selectActionAndRun;

    }

}

module.exports = selectRefactoringFactory;