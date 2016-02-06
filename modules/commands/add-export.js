'use strict';

var actions = require('../shared/common-actions');
var selectionFactory = require('../shared/selection-factory');
var logger = require('../shared/logger-factory')();

var addExport = require('../refactoring-logic/add-export');
var functionUtils = require('../shared/function-utils');
var exportTemplates = require('../json/templates.json').addExport;

function applyRefactor(vsEditor, functionName, lines) {
    var findType = addExport.hasExportObject(lines) ? 'object' : 'single';
    var exportType = addExport.hasExportExpression(lines) ? 'single' : 'newExport';
    var exportTemplate = findType === 'object' ? exportTemplates['objectAddition'] : exportTemplates[exportType];
    var exportLocation = addExport.exportLocation(lines, findType);

    actions.applyRefactorAtCoords(vsEditor, exportTemplate.replace(/\{functionName\}/g, functionName), exportLocation);
}

function applyExport(vsEditor, selection) {
    var functionName = functionUtils.getFunctionName(selection[0]);
    if (typeof functionName !== 'string') {
        logger.log('No appropriate named function to export did you select a line containing a function?');
    } else {
        applyRefactor(vsEditor, selection, vsEditor._document._lines);
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