'use strict';

var editActions = require('../shared/edit-actions');
var logger = require('../shared/logger-factory')();
var refactoring = require('../refactoring-logic/convert-to-named-function');
var selectionFactory = require('../shared/selection-factory');
var templateUtils = require('../shared/template-utils');
var utilities = require('../shared/utilities');

module.exports = function (vsEditor) {
    function applyRefactor(vsEditor, selection) {
        var coords = utilities.buildCoords(vsEditor, 0);
        var baseContext = templateUtils.buildBaseContext(vsEditor, selection);
        var updatedLine = refactoring.refactorToNamedFunction(selection[0]);

        selection[0] = templateUtils.fillTemplate([updatedLine], baseContext);
        editActions.applySetEdit(vsEditor, selection.join('\n'), coords);
    }

    function convertToNamedFunction(vsEditor) {
        var selection = selectionFactory(vsEditor).getSelection(0);

        if (selection === null) {
            logger.log('Cannot perform named function conversion on an empty selection.');
        } else if (!refactoring.canRefactorToNamed(selection[0])) {
            logger.log('No appropriate anonymous or member function to convert.');
        } else {
            applyRefactor(vsEditor, selection);
        }
    }

    return convertToNamedFunction.bind(null, vsEditor);

};