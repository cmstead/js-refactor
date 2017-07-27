'use strict';

function negateExpressionFactory(
    logger,
    selectionFactory,
    editActionsFactory,
    utilities,
    negateExpressionAction,
    vsCodeFactory) {

    return function (_, callback) {

        function applyRefactoring(vsEditor, selection, lines, coords) {

            if (selection === null) {
                logger.log('Cannot negate empty selection, be sure to select expression to negate');
            } else if (selection.length > 1) {
                logger.log('Negate expression does not support multi-line or mulitple selections')
            } else {
                var negatedExpression = negateExpressionAction.negateExpression(selection[0]);

                editActionsFactory(vsEditor)
                    .applySetEdit(negatedExpression, coords)
                    .then(callback);
            }
        }

        return function applyNegateExpression() {
            var vsEditor = vsCodeFactory.get().window.activeTextEditor;
            var selection = selectionFactory(vsEditor).getSelection(0);
            var lines = utilities.getDocumentLines(vsEditor);
            var coords = utilities.buildCoords(vsEditor, 0);

            applyRefactoring(vsEditor, selection, lines, coords);
        }

    };

}

module.exports = negateExpressionFactory;