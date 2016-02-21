'use strict';

var editActions = require('../shared/edit-actions');
var selectionFactory = require('../shared/selection-factory');
var logger = require('../shared/logger-factory')();

var addExport = require('../refactoring-logic/add-export');
var exportTemplates = require('../json/templates.json').addExport;
var functionUtils = require('../shared/function-utils');
var templateUtils = require('../shared/template-utils');
var utilities = require('../shared/utilities');

function applyRefactor(vsEditor, functionName, lines) {
    var findType = addExport.hasExportObject(lines) ? 'object' : 'single';
    var exportType = addExport.hasExportExpression(lines) ? 'single' : 'newExport';
    var exportTemplate = findType === 'object' ? exportTemplates['objectAddition'] : exportTemplates[exportType];
    var exportLocation = addExport.exportLocation(lines, findType);

    var text = exportTemplate.replace(/\{functionName\}/g, functionName)

    editActions.applySetEdit(vsEditor, text, exportLocation);
}

function applyExport(vsEditor, selection) {
    var functionName = functionUtils.getFunctionName(selection[0]);
    if (typeof functionName !== 'string') {
        logger.log('No appropriate named function to export did you select a line containing a function?');
    } else {
        applyRefactor(vsEditor, selection, utilities.getEditorDocument(vsEditor)._lines);
    }
}

function exportFunction(vsEditor) {
    var selection = selectionFactory(vsEditor).getSelection(0);

    if (selection === null) {
        logger.log('Cannot perform export on an empty selection.');
    } else {
        applyExport(vsEditor, selection);
    }
}

module.exports = exportFunction;