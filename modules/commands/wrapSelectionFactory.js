'use strict';

function wrapSelectionFactory(logger) {

    return function (callback) {
        const container = require('../../container');

        const commandActionData = require('../json/commandActionData');
        const wrapBehaviors = Object
            .keys(commandActionData)
            .filter(key => !commandActionData[key].excludeFromWrapList)
            .reduce(function (result, key) {
                const description = commandActionData[key].description;
                const command = commandActionData[key].command;

                result[description] = command;
                return result;
            }, {});

        function selectActionAndRun() {
            var items = Object.keys(wrapBehaviors);
            var options = {
                prompt: 'Select wrap action:'
            };

            logger.quickPick(items, options, function (value) {
                const refactoringKey = wrapBehaviors[value];
                container.build(refactoringKey)(callback)();
            });
        }

        return selectActionAndRun;

    }

}

module.exports = wrapSelectionFactory;