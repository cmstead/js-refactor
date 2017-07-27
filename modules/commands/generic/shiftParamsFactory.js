'use strict';

function shiftParamsFactory(
    logger,
    selectionFactory,
    editActionsFactory,
    utilities,
    variableOrderAction,
    vsCodeFactory) {

    return function (direction, _, callback) {

        function applyRefactor(vsEditor, editActions, selection) {
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
            var vsEditor = vsCodeFactory.get().window.activeTextEditor;
            var editActions = editActionsFactory(vsEditor);
            var selection = selectionFactory(vsEditor).getSelection(0);

            applyRefactor(vsEditor, editActions, selection);
        }

    };

}

module.exports = shiftParamsFactory;