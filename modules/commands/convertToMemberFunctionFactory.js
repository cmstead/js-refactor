'use strict';

function convertToMemberFunctionFactory(
    logger,
    selectionFactory,
    editActionsFactory,
    utilities,
    convertToMemberFunctionAction) {

    var refactoring = convertToMemberFunctionAction;

    return function (vsEditor, callback) {

        var editActions = editActionsFactory(vsEditor);

        function applyRefactor(selection) {
            var coords = utilities.buildCoords(vsEditor, 0);

            selection[0] = refactoring.refactorToMemberFunction(selection[0]);
            return editActions.applySetEdit(selection.join('\n'), coords);
        }


        function getErrorMessage(selection) {
            var message = '';

            if (selection === null) {
                message = 'Cannot perform member function conversion on an empty selection.';
            } else if (!refactoring.canConvertToMember(selection[0])) {
                message = 'No appropriate named function to convert did you select a line containing a function?';
            }

            return message;
        }

        return function convertToMemberFunction() {
            var selection = selectionFactory(vsEditor).getSelection(0);
            var message = getErrorMessage(selection);

            if (message !== '') {
                logger.log(message);
            } else {
                applyRefactor(selection).then(callback);
            }
        }

    };
}

module.exports = convertToMemberFunctionFactory;