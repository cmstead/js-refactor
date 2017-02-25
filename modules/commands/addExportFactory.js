'use strict';

var j = require('jfp');
var editActionsFactory = require('../shared/edit-actions-factory');

var exportTemplates = require('../json/templates.json').addExport;
var functionUtils = require('../shared/function-utils');
var templateUtils = require('../shared/template-utils');
var utilities = require('../shared/utilities');

function addExportFactory(logger, selectionFactory, addExportAction) {

    return function (vsEditor, callback) {

        var editActions = editActionsFactory(vsEditor);
        var selection = selectionFactory(vsEditor).getSelection(0);

        function getExportType(searchType, lines) {
            var exportType = addExportAction.hasExportExpression(lines) ? 'single' : 'newExport';
            return searchType === 'object' ? 'objectAddition' : exportType;
        }

        function applyRefactor(functionName, lines) {
            var searchType = addExportAction.hasExportObject(lines) ? 'object' : 'single';
            var exportTemplate = exportTemplates[getExportType(searchType, lines)];
            var context = templateUtils.buildExtendedContext(vsEditor, [functionName], { functionName: functionName });

            var coords = addExportAction.exportLocation(lines, searchType);
            var text = templateUtils.fillTemplate(exportTemplate, context);

            return editActions.applySetEdit(text, coords);
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
                applyRefactor(functionName, utilities.getEditorDocument(vsEditor)._lines).then(callback);
            }
        }

        return function () {
            applyExport(cleanSelection(j.either([], selection)));
        };

    };
}

addExportFactory['@dependencies'] = [
    'logger',
    'selectionFactory',
    'addExportAction'
];

module.exports = addExportFactory;