'use strict';

function selectRefactoringFactory(
    logger,
) {
    
    return function (callback) {
        const container = require('../../container');
        
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