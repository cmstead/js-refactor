'use strict';

var actions = require('../shared/common-actions');
var selectionFactory = require('../shared/selection-factory');
var refactoring = require('../refactoring-logic/anonymous-function-refactor');
var logger = require('../shared/logger-factory')();

function applyConversion (vsEditor, selection){
    if(!refactoring.canRefactorToNamed(selection[0])){
        logger.log('No appropriate anonymous function to convert did you select a function which is assigned to a variable?');
    } else {
        selection[0] = refactoring.refactorToNamedFunction(selection[0]);
        actions.applyRefactor(vsEditor, selection.join('\n'));
    }
}

function convertToNamedFunction(vsEditor) {
    var selection = selectionFactory(vsEditor).getSelection(0);
    
    if (selection === null) {
        logger.log('Cannot perform named function conversion on an empty selection.');
    } else {
        applyConversion(vsEditor, selection);
    }
}

module.exports = convertToNamedFunction;