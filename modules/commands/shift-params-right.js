'use strict';

var editActions = require('../shared/edit-actions');
var logger = require('../shared/logger-factory')();
var selectionFactory = require('../shared/selection-factory');
var utilities = require('../shared/utilities');
var variableOrder = require('../refactoring-logic/variable-order');

module.exports = function (vsEditor, callback) {

    function applyRefactor(vsEditor, selection) {
        var coords = utilities.buildCoords(vsEditor, 0);
        var text = variableOrder.shiftParamsRight(selection[0]);

        return editActions.applySetEdit(vsEditor, text, coords);
    }

    function wrapInCondition(vsEditor) {
        var selection = selectionFactory(vsEditor).getSelection(0);

        if (selection === null) {
            logger.info('Cannot shift parameters on an empty selection.');
        } else {
            applyRefactor(vsEditor, selection).then(callback);
        }
    }

    return wrapInCondition.bind(null, vsEditor);
}