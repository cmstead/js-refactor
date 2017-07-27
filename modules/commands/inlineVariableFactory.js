'use strict';

var j = require('jfp');

function inlineVariableFactory(
    logger,
    editActionsFactory,
    extensionHelper,
    sourceUtils,
    selectionFactory,
    utilities,
    inlineVariableAction,
    vsCodeFactory) {

    return function (vsEditor, callback) {

        function applyRefactor(vsEditor, selectionData, scopeData, lines) {
            var scopeBounds = j.deref('scopeBounds')(scopeData);
            var selectedVar = j.eitherString('')(j.deref('selection.0')(selectionData));

            var isAssignedVariable = inlineVariableAction.isAssigned(selectedVar);
            var valueInFunctionScope = inlineVariableAction.isValueInScope(scopeBounds, selectionData.selectionCoords);

            if (selectionData.selection === null) {
                logger.info('Cannot inline empty selection');
            } else if (selectionData.selection.length > 1) {
                logger.info('Inline variable does not currently support multiline values');
            } else if(!isAssignedVariable) {
                logger.info('Variable is either not local or unassigned, cannot inline');
            } else if (!valueInFunctionScope) {
                logger.info('Cannot inline variable if it is not inside a function');
            } else {
                buildAndApply(vsEditor, selectionData, scopeData, lines);
            }
        }

        function buildAndApply(vsEditor, selectionData, scopeData, lines) {
            var editActions = editActionsFactory(vsEditor);

            var bounds = scopeData.scopeBounds;
            var selection = selectionData.selection[0];

            var replacementSource = inlineVariableAction.getReplacementSource(selection, bounds, lines);


            editActions.applySetEdit(replacementSource, bounds).then(callback);
        }

        function getSelectionData(vsEditor) {
            var selection = selectionFactory(vsEditor).getSelection(0);
            var selectionCoords = utilities.buildCoords(vsEditor, 0);

            var lineOffset = inlineVariableAction.getWhitespaceOffset(j.eitherArray([''])(selection)[0]);

            selectionCoords.start[1] = selectionCoords.start[1] + lineOffset;

            return {
                selection: selection,
                selectionCoords: selectionCoords
            };
        }

        return function inlineAction() {
            var vsEditor = vsCodeFactory.get().window.activeTextEditor;
            var getScopeBounds = extensionHelper.returnOrDefault(null, sourceUtils.scopeDataFactory);
            var selectionData = getSelectionData(vsEditor);

            var lines = utilities.getEditorDocument(vsEditor)._lines;
            var scopeData = getScopeBounds(lines, selectionData);

            applyRefactor(vsEditor, selectionData, scopeData, lines);
        }
    }
}

module.exports = inlineVariableFactory;