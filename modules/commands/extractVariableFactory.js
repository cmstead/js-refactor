'use strict';

var j = require('jfp');

function extractVariableFactory(
    logger,
    editActionsFactory,
    extensionHelper,
    sourceUtils,
    selectionFactory,
    utilities,
    extractVariableAction) {

    return function (vsEditor, callback) {

        function applyRefactor(selectionData, scopeData, lines) {
            var scopeBounds = j.deref('scopeBounds')(scopeData);
            var valueInScope = extractVariableAction.isValueInScope(scopeBounds, selectionData.selectionCoords);

            if (selectionData.selection === null) {
                logger.info('Cannot extract empty selection as a variable');
            } else if (selectionData.selection.length > 1) {
                logger.info('Extract varialble does not currently support multiline values');
            } else if (!valueInScope) {
                logger.info('Cannot extract variable if it is not inside a function');
            } else {
                // console.log(scopeBounds);
                // console.log('scope lines: ' + getScopeLines(lines, scopeBounds));

                logger.input({ prompt: 'Name of your variable' }, function (name) {
                    buildAndApply(selectionData, scopeData, name, lines);
                });
            }
        }

        function buildAndApply(selectionData, scopeData, name, lines) {
            var editActions = editActionsFactory(vsEditor);

            var varCoords = extractVariableAction.buildVarCoords(scopeData);
            var edits = extractVariableAction.getEdits(selectionData, scopeData, name);
            var variableString = extractVariableAction.buildVariableString(name, selectionData);

            editActions.applySetEdits(edits).then(function () {
                editActions.applySetEdit(variableString, varCoords).then(callback);
            });
        }


        function getSelectionData(vsEditor) {
            return {
                selection: selectionFactory(vsEditor).getSelection(0),
                selectionCoords: utilities.buildCoords(vsEditor, 0)
            };
        }

        function getScopeLines(lines, scopeBounds) {
            var startLine = scopeBounds.start[0] - 1;
            var endLine = scopeBounds.end[0] - 1;

            var charStart = scopeBounds.start[1] - 1;
            var charEnd = scopeBounds.end[1] - 1;

            var scopeLines = lines.slice(startLine, endLine);

            var lastIndex = scopeLines.length - 1;

            scopeLines[0] = scopeLines[0].substr(charStart);
            scopeLines[lastIndex] = scopeLines[lastIndex].substr(charEnd);

            return scopeLines;
        }

        return function extractAction() {
            var getScopeBounds = extensionHelper.returnOrDefault(null, sourceUtils.scopeDataFactory);
            var selectionData = getSelectionData(vsEditor);


            var lines = utilities.getEditorDocument(vsEditor)._lines;
            var scopeData = getScopeBounds(lines, selectionData);

            applyRefactor(selectionData, scopeData, lines);
        }
    }
}

module.exports = extractVariableFactory;