'use strict';

var actions = require('../shared/common-actions');
var selectionFactory = require('../shared/selection-factory');
var logger = require('../shared/logger-factory')();

var addExport = require('../refactoring-logic/add-export');
var functionUtils = require('../shared/function-utils');
var exportTemplates = require('../json/templates.json').addExport;

function applyRefactor(vsEditor, selection, lines) {
    var functionName = functionUtils.getFunctionName(selection[0]),
        findType = addExport.hasExportObject(lines) ? 'object' : 'single',
        exportType = addExport.hasExportExpression(lines) ? 'single' : 'newExport',
        exportTemplate = findType === 'object' ? exportTemplates['objectAddition'] : exportTemplates[exportType],
        exportLocation = addExport.exportLocation(lines, findType);

    // Build new function to take different coordinates
    actions.applyRefactorAtCoords(vsEditor, exportTemplate.replace('{functionName}', functionName), exportLocation);
}

function applyExport(vsEditor, selection) {
    if (typeof functionUtils.functionName(selection[0]) !== 'string') {
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