'use strict';

function negateExpressionFactory(
    logger,
    selectionFactory,
    editActionsFactory,
    utilities,
    negateExpressionAction) {

    return function (vsEditor, callback) {

        function applyRefactoring(selection, lines, coords) {

            if (selection === null) {
                console.log('error 1');
                logger.log('Cannot negate empty selection, be sure to select expression to negate');
            } else if (selection.length > 1) {
                console.log('error 2', selection);
                logger.log('Negate expression does not support multi-line or mulitple selections')
            } else {
                console.log('success');
                var negatedExpression = negateExpressionAction.negateExpression(selection[0]);

                editActionsFactory(vsEditor)
                    .applySetEdit(negatedExpression, coords)
                    .then(callback);
            }
        }

        return function applyNegateExpression() {
            var selection = selectionFactory(vsEditor).getSelection(0);
            var lines = utilities.getDocumentLines(vsEditor);
            var coords = utilities.buildCoords(vsEditor, 0);

            applyRefactoring(selection, lines, coords);
        }

    };

}

module.exports = negateExpressionFactory;