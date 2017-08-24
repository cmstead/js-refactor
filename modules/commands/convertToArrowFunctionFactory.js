'use strict';

function convertToArrowFunctionFactory(
    logger,
    selectionFactory,
    editActionsFactory,
    utilities,
    convertToArrowFunctionAction,
    vsCodeFactory) {

    return function (_, callback) {

        const canConvertToArrow = convertToArrowFunctionAction.canConvertToArrow;
        const refactorFunctionDef = convertToArrowFunctionAction.refactorFunctionDef;

        function applyRefactoring(editActions, selection, coords) {
            if (selection === null) {
                logger.log('Cannot perform member function conversion on an empty selection.');
            } else if (!canConvertToArrow(selection[0])) {
                logger.log('No appropriate named function to convert did you select a line containing a function?');
            } else {
                var refactoredSelection = refactorFunctionDef(selection);

                editActions
                    .applySetEdit(refactoredSelection, coords)
                    .then(callback);
            }

        }

        return function convertToArrowFunction() {
            var vsEditor = vsCodeFactory.get().window.activeTextEditor;

            var editActions = editActionsFactory(vsEditor);
            var selection = selectionFactory(vsEditor).getSelection(0);
            var coords = utilities.buildCoords(vsEditor, 0);

            applyRefactoring(editActions, selection, coords);
        };
    };
}

module.exports = convertToArrowFunctionFactory;