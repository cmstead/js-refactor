'use strict';

var actions = require('../shared/common-actions');
var selectionFactory = require('../shared/selection-factory');
var refactoring = require('../refactoring-logic/convert-to-member-function');
var logger = require('../shared/logger-factory')();

function applyConversion (vsEditor, selection){
    if(!refactoring.canConvertToMember(selection[0])){
        logger.log('No appropriate named function to convert did you select a line containing a function?');
    } else {
        selection[0] = refactoring.refactorToMemberFunction(selection[0]);
        actions.applyRefactor(vsEditor, selection.join('\n'));
    }
}

function convertToMemberFunction(vsEditor) {
    var selection = selectionFactory(vsEditor).getSelection(0);
    
    if (selection === null) {
        logger.log('Cannot perform member function conversion on an empty selection.');
    } else {
        applyConversion(vsEditor, selection);
    }
}

module.exports = convertToMemberFunction;