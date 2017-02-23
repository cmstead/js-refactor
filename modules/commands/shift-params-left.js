'use strict';

var editActionsFactory = require('../shared/edit-actions-factory');
var logger = require('../shared/logger-factory')();
var selectionFactory = require('../shared/selection-factory');
var utilities = require('../shared/utilities');
var variableOrder = require('../refactoring-logic/variable-order');

module.exports = function (vsEditor, callback) {
    var editActions = editActionsFactory(vsEditor);
    
    function applyRefactor(selection) {
        var coords = utilities.buildCoords(vsEditor, 0);
        var text = variableOrder.shiftParamsLeft(selection[0]);

        return editActions.applySetEdit(text, coords);
    }

    function shiftParamsLeft() {
        var selection = selectionFactory(vsEditor).getSelection(0);

        if (selection === null) {
            logger.info('Cannot shift parameters on an empty selection.');
        } else {
            applyRefactor(selection).then(callback);
        }
    }

    return shiftParamsLeft;
};