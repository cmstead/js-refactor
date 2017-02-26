'use strict';




function shiftParamsRightFactory(
    logger,
    selectionFactory,
    editActionsFactory,
    utilities,
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
    'editActionsFactory',
    'utilities',
    'variableOrderAction'
];

module.exports = shiftParamsRightFactory;