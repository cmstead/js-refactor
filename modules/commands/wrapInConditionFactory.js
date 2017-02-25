'use strict';

var editActionsFactory = require('../shared/edit-actions-factory');
var templates = require('../json/templates.json');
var templateUtils = require('../shared/template-utils');
var utilities = require('../shared/utilities');


function wrapInConditionFactory(logger, selectionFactory) {
    return function (vsEditor, callback) {
        var editActions = editActionsFactory(vsEditor);

        function applyRefactor(selection) {
            var coords = utilities.buildCoords(vsEditor, 0);
            var context = templateUtils.buildBaseContext(vsEditor, selection);
            var text = templateUtils.fillTemplate(templates.cond, context);

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

wrapInConditionFactory['@dependencies'] = [
    'logger',
    'selectionFactory'
]

module.exports = wrapInConditionFactory;