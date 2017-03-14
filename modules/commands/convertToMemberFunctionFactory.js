'use strict';

function convertToMemberFunctionFactory(
    logger,
    selectionFactory,
    editActionsFactory,
    utilities,
    convertToMemberFunctionAction) {

    return function (vsEditor, callback) {


        var canConvertToMember = convertToMemberFunctionAction.canConvertToMember;
        var refactorFunctionDef = convertToMemberFunctionAction.refactorFunctionDef;

        function applyRefactoring(editActions, selection, coords) {
            if (selection === null) {
                logger.log('Cannot perform member function conversion on an empty selection.');
            } else if (!canConvertToMember(selection[0])) {
                logger.log('No appropriate named function to convert did you select a line containing a function?');
            } else {
                var refactoredSelection = refactorFunctionDef(selection);

                editActions
                    .applySetEdit(refactoredSelection, coords)
                    .then(callback);
            }
        }

        return function convertToMemberFunction() {
            var editActions = editActionsFactory(vsEditor);
            var selection = selectionFactory(vsEditor).getSelection(0);
            var coords = utilities.buildCoords(vsEditor, 0);

            applyRefactoring(editActions, selection, coords);
        }

    };
}

module.exports = convertToMemberFunctionFactory;