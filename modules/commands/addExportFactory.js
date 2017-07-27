'use strict';

var j = require('jfp');

function addExportFactory(
    logger,
    selectionFactory,
    editActionsFactory,
    utilities,
    addExportAction,
    vsCodeFactory) {

    return function (_, callback) {

        function applyRefactoring(vsEditor, selection, lines, refactorData) {
            if (refactorData.functionName === '') {
                logger.log('No appropriate named function to export did you select a line containing a function?');
            } else {
                editActionsFactory(vsEditor)
                    .applySetEdit(refactorData.text, refactorData.coords)
                    .then(callback);
            }
        }

        return function applyExport() {
            var vsEditor = vsCodeFactory.get().window.activeTextEditor;

            var selection = selectionFactory(vsEditor).getSelection(0);
            var lines = utilities.getDocumentLines(vsEditor);
            var refactorData = addExportAction.getRefactorData(selection, lines);

            applyRefactoring(vsEditor, selection, lines, refactorData);
        }

    };
}

module.exports = addExportFactory;