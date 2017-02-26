'use strict';



var templateUtils = require('../shared/template-utils');


function convertToNamedFunctionFactory(
    logger, 
    selectionFactory, 
    editActionsFactory,
    utilities,
    convertToNamedFunctionAction) {

    var refactoring = convertToNamedFunctionAction;

    return function (vsEditor, callback) {
        var editActions = editActionsFactory(vsEditor);

        function applyRefactor(selection) {
            var coords = utilities.buildCoords(vsEditor, 0);
            var baseContext = templateUtils.buildBaseContext(vsEditor, selection);
            var updatedLine = refactoring.refactorToNamedFunction(selection[0]);

            selection[0] = templateUtils.fillTemplate([updatedLine], baseContext);
            return editActions.applySetEdit(selection.join('\n'), coords);
        }

        return function convertToNamedFunction() {
            var selection = selectionFactory(vsEditor).getSelection(0);

            if (selection === null) {
                logger.log('Cannot perform named function conversion on an empty selection.');
            } else if (!refactoring.canRefactorToNamed(selection[0])) {
                logger.log('No appropriate anonymous or member function to convert.');
            } else {
                applyRefactor(selection).then(callback);
            }
        }

    };
}

convertToNamedFunctionFactory['@dependencies'] = [
    'logger',
    'selectionFactory',
    'editActionsFactory',
    'utilities',
    'convertToNamedFunctionAction'
];

module.exports = convertToNamedFunctionFactory;