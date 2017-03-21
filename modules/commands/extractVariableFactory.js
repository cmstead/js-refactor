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
                logger.input({ prompt: 'Name of your variable' }, function (name) {
                    buildAndApply(selectionData, scopeData, name, lines);
                });
            }
        }

        function buildAndApply(selectionData, scopeData, name, lines) {
            var bounds = getDocumentScopeBounds(scopeData.scopeBounds);
            var selection = selectionData.selection[0];
            var scopeSource = getScopeLines(lines, bounds).join('\n');
            var replacementSource = scopeSource.replace(selection, name);

            console.log(scopeSource, replacementSource);

            var editActions = editActionsFactory(vsEditor);

            var varCoords = extractVariableAction.buildVarCoords(scopeData);
            var variableString = extractVariableAction.buildVariableString(name, selectionData);

            editActions.applySetEdit(replacementSource, bounds).then(function () {
                editActions.applySetEdit(variableString, varCoords).then(callback);
            });
        }


        function getSelectionData(vsEditor) {
            return {
                selection: selectionFactory(vsEditor).getSelection(0),
                selectionCoords: utilities.buildCoords(vsEditor, 0)
            };
        }

        function getDocumentScopeBounds(scopeBounds) {
            console.log(scopeBounds);
            var start = scopeBounds.start;
            var end = scopeBounds.end;

            return {
                start: [start[0] - 1, start[1] - 1],
                end: [end[0] - 1, end[1] - 1]
            };
        }

        function getScopeLines(lines, bounds) {
            var scopeLines = null;

            if(bounds.end[0] === lines.length - 1) {
                scopeLines = lines.slice(bounds.start[0]);
            } else {
                scopeLines = lines.slice(bounds.start[0], bounds.end[0]);
            }

            var lastIndex = scopeLines.length - 1;

            scopeLines[0] = scopeLines[0].substr(bounds.start[1]);
            scopeLines[lastIndex] = scopeLines[lastIndex].substr(0, bounds.end[1] + 1);

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