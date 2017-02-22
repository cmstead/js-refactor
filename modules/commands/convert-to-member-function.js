'use strict';

var editActions = require('../shared/edit-actions');
var logger = require('../shared/logger-factory')();
var refactoring = require('../refactoring-logic/convert-to-member-function');
var selectionFactory = require('../shared/selection-factory');
var utilities = require('../shared/utilities');

module.exports = function (vsEditor, callback) {
    var selection = selectionFactory(vsEditor).getSelection(0);

    function applyRefactor() {
        var coords = utilities.buildCoords(vsEditor, 0);

        selection[0] = refactoring.refactorToMemberFunction(selection[0]);
        return editActions.applySetEdit(vsEditor, selection.join('\n'), coords);
    }


    function getErrorMessage() {
        var message = '';
        
        if (selection === null) {
            message = 'Cannot perform member function conversion on an empty selection.';
        } else if (!refactoring.canConvertToMember(selection[0])) {
            message = 'No appropriate named function to convert did you select a line containing a function?';
        }
        
        return message;
    }

    function convertToMemberFunction() {
        var message = getErrorMessage();
        
        if (message !== '') {
            logger.log(message);
        } else {
            applyRefactor().then(callback);
        }
    }

    return convertToMemberFunction;

};