'use strict';

var j = require('jfp');

function extractVariableFactory(
    logger,
    editActionsFactory,
    utilities,
    sourceUtils,
    templateUtils,
    extractVariableAction) {

    return function (vsEditor, callback) {
        var editActions = editActionsFactory(vsEditor);

        function applyRefactor(selectionData, scopeData, name) {
            var varCoords = extractVariableAction.buildVarCoords(scopeData);
            var edits = extractVariableAction.getEdits(selectionData, scopeData, name);
            var variableString = templateUtils.templateFactory('newVariable')(name, selectionData);

            return editActions.applySetEdits(edits).then(function () {
                return editActions.applySetEdit(variableString, varCoords);
            });
        }

        function getScopeAndValueData(selectionData) {
            var result = {
                scopeData: null,
                valueInScope: false
            };

            // This reference error needs some sort of longer-term management and fix.
            try {
                result.scopeData = sourceUtils.scopeDataFactory(vsEditor, selectionData);
                result.valueInScope = extractVariableAction.isValueInScope(result.scopeData.scopeBounds, selectionData.selectionCoords)
            } catch (e) { /* scope process failed */ }

            return result;
        }

        function returnOrDefault (defaultValue, fn){
            try{
                return fn();
            } catch (e) {
                return defaultValue;
            }
        }

        return function extractAction() {
            var selectionData = sourceUtils.selectionDataFactory(vsEditor);
            var scopeAndValueData = getScopeAndValueData(selectionData);

            var scopeData = scopeAndValueData.scopeData;
            var valueInScope = scopeAndValueData.valueInScope;

            if (selectionData.selection === null) {
                logger.info('Cannot extract empty selection as a variable');
            } else if (selectionData.selection.length > 1) {
                logger.info('Extract varialble does not currently support multiline values');
            } else if (!valueInScope) {
                logger.info('Cannot extract variable if it is not inside a function');
            } else {
                logger.input({ prompt: 'Name of your variable' }, function (name) {
                    applyRefactor(selectionData, scopeData, name).then(callback);
                });
            }
        }
    }
}

module.exports = extractVariableFactory;