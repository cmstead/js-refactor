'use strict';

function selectRefactoringFactory(
    logger
) {

    return function (callback) {
        const container = require('../../container');

        const commandActionData = require('../json/commandActionData');
        let refactoringKeys = Object
            .keys(commandActionData)
            .filter(key => !commandActionData[key].excludeFromSelectList)
            .reduce(function (result, key) {
                const description = commandActionData[key].description;
                const command = commandActionData[key].command;

                result[description] = command;
                return result;
            }, {});

        const refactorPattern = /^Refactor/;
        const actionPattern = /^Action/;

        function pickOrdering(name1, name2) {
            if(name1 < name2) {
                return -1;
            } if (name1 > name2) {
                return 1
            } else {
                return 0;
            }
        }

        function actionSort(name1, name2) {
            const bothAreRefactor = refactorPattern.test(name1) && refactorPattern.test(name2);
            const neitherAreRefactor = !refactorPattern.test(name1) && !refactorPattern.test(name2);

            if (bothAreRefactor || neitherAreRefactor) {
                return pickOrdering(name1, name2);
            } else if(refactorPattern.test(name1)) {
                return -1;
            } else {
                return 1;
            }
        }

        function selectActionAndRun() {
            var items = Object.keys(refactoringKeys);
            items.sort(actionSort);

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