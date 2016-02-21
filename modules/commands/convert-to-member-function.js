'use strict';

var editActions = require('../shared/edit-actions');
var logger = require('../shared/logger-factory')();
var refactoring = require('../refactoring-logic/convert-to-member-function');
var selectionFactory = require('../shared/selection-factory');
var utilities = require('../shared/utilities');

function applyRefactor(vsEditor, selection) {
    var coords = utilities.buildCoords(vsEditor, 0);

    selection[0] = refactoring.refactorToMemberFunction(selection[0]);
    editActions.applySetEdit(vsEditor, selection.join('\n'), coords);
}

function convertToMemberFunction(vsEditor) {
    var selection = selectionFactory(vsEditor).getSelection(0);

    if (selection === null) {
        logger.log('Cannot perform member function conversion on an empty selection.');
    } else if (!refactoring.canConvertToMember(selection[0])) {
        logger.log('No appropriate named function to convert did you select a line containing a function?');
    } else {
        applyRefactor(vsEditor, selection);
    }
}

module.exports = convertToMemberFunction;