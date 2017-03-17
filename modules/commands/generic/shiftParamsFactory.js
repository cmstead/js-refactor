'use strict';

function shiftParamsFactory(
    logger,
    selectionFactory,
    editActionsFactory,
    utilities,
    variableOrderAction) {

    return function (direction, vsEditor, callback) {

        function applyRefactor(editActions, selection) {
            var coords = utilities.buildCoords(vsEditor, 0);

            if (selection === null) {
                logger.info('Cannot shift parameters on an empty selection.');
            } else {
                var parameterShift = pickShiftDirection(direction.toLowerCase());
                var text = parameterShift(selection[0]);
                editActions.applySetEdit(text, coords).then(callback);
            }
        }

        function pickShiftDirection(direction) {
            return direction === 'left' ? variableOrderAction.shiftParamsLeft : variableOrderAction.shiftParamsRight
        }

        return function () {
            var editActions = editActionsFactory(vsEditor);
            var selection = selectionFactory(vsEditor).getSelection(0);

            applyRefactor(editActions, selection);
        }

    };

}

module.exports = shiftParamsFactory;