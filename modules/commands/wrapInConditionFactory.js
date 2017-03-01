'use strict';

var condTemplate = require('../json/templates.json').cond;

function wrapInConditionFactory(
    logger, 
    selectionFactory,
    utilities,
    templateUtils,
    editActionsFactory) {

    return function (vsEditor, callback) {
        var editActions = editActionsFactory(vsEditor);

        function applyRefactor(selection) {
            var coords = utilities.buildCoords(vsEditor, 0);
            var context = templateUtils.buildBaseContext(vsEditor, selection);
            var text = templateUtils.fillTemplate(condTemplate, context);

            return editActions.applySetEdit(text, coords);
        }

        return function wrapInCondition() {
            var selection = selectionFactory(vsEditor).getSelection(0);

            if (selection === null) {
                logger.info('Cannot wrap empty selection. To create a new if block, use the if (cond) snippet.');
            } else {
                applyRefactor(selection).then(callback);
            }
        }

    }
}

module.exports = wrapInConditionFactory;