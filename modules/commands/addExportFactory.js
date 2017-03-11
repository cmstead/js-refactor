'use strict';

var j = require('jfp');
var eitherString = j.either('string');
var eitherArray = j.either('array');

function addExportFactory(
    logger,
    selectionFactory,
    functionUtils,
    editActionsFactory,
    utilities,
    templateUtils,
    addExportAction) {

    var exportTemplates = templateUtils.getTemplate('addExport');

    return function (vsEditor, callback) {
        var editActions = editActionsFactory(vsEditor);
        var selection = selectionFactory(vsEditor).getSelection(0);

        function getExportTemplate(searchType, lines) {
            var exportType = 'newExport';

            if(searchType === 'object') {
                exportType = 'objectAddition';
            } else if (addExportAction.hasExportExpression(lines)) {
                exportType = 'single';
            }
            
            return exportTemplates[exportType];
        }

        function getRefactorText (functionName, searchType, lines) {
            var exportTemplate = getExportTemplate(searchType, lines);
            var context = templateUtils.buildExtendedContext(vsEditor, [functionName], { functionName: functionName });

            return templateUtils.fillTemplate(exportTemplate, context);
        }

        function applyRefactor(functionName, lines) {
            var searchType = addExportAction.hasExportObject(lines) ? 'object' : 'single';

            var coords = addExportAction.exportLocation(lines, searchType);
            var text = getRefactorText(functionName, searchType, lines);

            return editActions.applySetEdit(text, coords);
        }

        function cleanSelection(selection) {
            var cleanSelection = selection.filter(function (value) { return value.trim() !== ''; });
            var cleanLine = eitherString('')(cleanSelection[0]);
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
            applyExport(cleanSelection(eitherArray([])(selection)));
        };

    };
}

module.exports = addExportFactory;