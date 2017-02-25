'use strict';

var editActionsFactory = require('../shared/edit-actions-factory');

var utilities = require('../shared/utilities');


function shiftParamsRightFactory(
    logger,
    selectionFactory,
    variableOrderAction) {

    return function (vsEditor, callback) {

        var editActions = editActionsFactory(vsEditor);

        function applyRefactor(selection) {
            var coords = utilities.buildCoords(vsEditor, 0);
            var text = variableOrderAction.shiftParamsRight(selection[0]);

            return editActions.applySetEdit(text, coords);
        }

        return function shiftParamsRight() {
            var selection = selectionFactory(vsEditor).getSelection(0);

            if (selection === null) {
                logger.info('Cannot shift parameters on an empty selection.');
            } else {
                applyRefactor(selection).then(callback);
            }
        }

    }

}

shiftParamsRightFactory['@dependencies'] = [
    'logger',
    'selectionFactory',
    'variableOrderAction'
];

module.exports = shiftParamsRightFactory;