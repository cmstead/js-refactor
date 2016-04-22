'use strict';

var j = require('jfp');
var editActions = require('../shared/edit-actions');
var selectionFactory = require('../shared/selection-factory');
var logger = require('../shared/logger-factory')();

var addExport = require('../refactoring-logic/add-export');
var exportTemplates = require('../json/templates.json').addExport;
var functionUtils = require('../shared/function-utils');
var templateUtils = require('../shared/template-utils');
var utilities = require('../shared/utilities');

module.exports = function (vsEditor) {
    var selection = selectionFactory(vsEditor).getSelection(0);

    function getExportType (searchType, lines){
        var exportType = addExport.hasExportExpression(lines) ? 'single' : 'newExport';
        return searchType === 'object' ? 'objectAddition' : exportType;
    }

    function applyRefactor(functionName, lines) {
        var searchType = addExport.hasExportObject(lines) ? 'object' : 'single';
        var exportTemplate = exportTemplates[getExportType(searchType, lines)];
        var context = templateUtils.buildExtendedContext(vsEditor, [functionName], { functionName: functionName });

        var coords = addExport.exportLocation(lines, searchType);
        var text = templateUtils.fillTemplate(exportTemplate, context);

        editActions.applySetEdit(vsEditor, text, coords);
    }

    function cleanSelection(selection) {
        var cleanSelection = selection.filter(function (value) { return value.trim() !== ''; });
        var cleanLine = j.either('', cleanSelection[0]);
        var containsFunction = cleanLine.match(/function/) !== null;

        return containsFunction ? cleanSelection : [selectionFactory(vsEditor).getSelectionLine(0)];
    }

    function applyExport(selection) {
        var message = 'No appropriate named function to export did you select a line containing a function?';
        var functionName = functionUtils.getFunctionName(selection[0]);

        if (functionName.trim() === '') {
            logger.log(message);
        } else {
            applyRefactor(functionName, utilities.getEditorDocument(vsEditor)._lines);
        }
    }

    applyExport(cleanSelection(j.either([], selection)));

};