'use strict';

function convertToNamedFunctionFactory(
    logger,
    selectionFactory,
    editActionsFactory,
    utilities,
    convertToNamedFunctionAction) {

    return function (vsEditor, callback) {

        var canRefactorToNamed = convertToNamedFunctionAction.canRefactorToNamed;
        var buildRefactorString = convertToNamedFunctionAction.buildRefactorString;

        function applyRefactor(editActions, selection, coords) {
            if (selection === null) {
                logger.log('Cannot perform named function conversion on an empty selection.');
            } else if (!canRefactorToNamed(selection[0])) {
                logger.log('No appropriate anonymous or member function to convert.');
            } else {
                var refactorString = buildRefactorString(selection);

                editActions
                    .applySetEdit(refactorString, coords)
                    .then(callback);
            }
        }

        return function convertToNamedFunction() {
            var editActions = editActionsFactory(vsEditor);
            var selection = selectionFactory(vsEditor).getSelection(0);
            var coords = utilities.buildCoords(vsEditor, 0);

            applyRefactor(editActions, selection, coords);
        }

    };
}

module.exports = convertToNamedFunctionFactory;