'use strict';

var j = require('jfp');

function addExportFactory(
    logger,
    selectionFactory,
    functionUtils,
    editActionsFactory,
    utilities,
    addExportAction) {

    return function (vsEditor, callback) {

        function applyExport(selection) {
            var cleanedSelection = addExportAction.cleanSelection(selection);
            var functionName = functionUtils.getFunctionName(cleanedSelection[0]);

            if (functionName === '') {
                logger.log('No appropriate named function to export did you select a line containing a function?');
            } else {
                var lines = utilities.getDocumentLines(vsEditor);
                applyRefactor(functionName, lines).then(callback);
            }
        }

        function applyRefactor(functionName, lines) {
            var searchType = addExportAction.getSearchType(lines);
            
            var coords = addExportAction.exportLocation(lines, searchType);
            var text = addExportAction.getRefactorText(functionName, searchType, lines);

            return editActionsFactory(vsEditor).applySetEdit(text, coords);
        }

        return function () {
            var selector = selectionFactory(vsEditor);
            var selection = j.eitherArray([])(selector.getSelection(0));

            applyExport(selection);
        };

    };
}

module.exports = addExportFactory;