'use strict';

var j = require('jfp');

function extractVariableFactory(
    logger,
    editActionsFactory,
    utilities,
    sourceUtils,
    templateUtils) {

    return function (vsEditor, callback) {
        var editActions = editActionsFactory(vsEditor);

        function between(start, end, value) {
            return start <= value && value <= end;
        }

        function isValueInScope(scopeBounds, valueCoords) {
            var scopeStart = scopeBounds.start;
            var scopeEnd = scopeBounds.end;
            var valueStart = valueCoords.start;

            return between(scopeStart[0], scopeEnd[0], valueStart[0]);
        }

        function addVarEdit(varName, edits, coords) {
            var edit = {
                value: varName,
                coords: utilities.buildEsprimaCoords(coords)
            };

            return [edit].concat(edits);
        }

        function getTokensInScope(scopeIndices, tokens) {
            return tokens.filter(function (__, index) { return between(scopeIndices.top, scopeIndices.bottom, index) });
        }

        function getMatchLocations(value, tokens) {
            return tokens.filter(function (token) { return token.value === value; })
                .map(j.pick('loc'));
        }

        function getReplacementLocations(tokens, scopeIndices, value) {
            var edits = getTokensInScope(scopeIndices, tokens);
            return getMatchLocations(value, edits);
        }

        function buildVarCoords(scopeData) {
            var varCoords = {
                start: scopeData.scopeBounds.start,
                end: scopeData.scopeBounds.start
            };

            varCoords.start[1] = 0;
            varCoords.end[1] = 0;

            return varCoords;
        }

        function adjustEdit(edit) {
            edit.coords.start[0] -= 1;
            edit.coords.end[0] -= 1;

            return edit;
        }

        function extractVariable(selectionData, scopeData, name) {
            var tokens = scopeData.tokens;
            var scopeIndices = scopeData.scopeIndices;
            var value = selectionData.selection[0];
            var varCoords = buildVarCoords(scopeData);

            var edits = getReplacementLocations(tokens, scopeIndices, value).reduce(j.partial(addVarEdit, name), []).map(adjustEdit);
            var variableString = templateUtils.templateFactory('newVariable')(vsEditor, name, selectionData);

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
                result.valueInScope = isValueInScope(result.scopeData.scopeBounds, selectionData.selectionCoords)
            } catch (e) { /* scope process failed */ }

            return result;
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
                    extractVariable(selectionData, scopeData, name).then(callback);
                });
            }
        }
    }
}

module.exports = extractVariableFactory;