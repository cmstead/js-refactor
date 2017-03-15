'use strict';

var j = require('jfp');

function extractVariableAction(
    templateUtils,
    utilities,
    extensionHelper) {

    function isValueInScope(scopeBounds, valueCoords) {
        var scopeStart = scopeBounds.start[0];
        var scopeEnd = scopeBounds.end[0];
        var valueStart = valueCoords.start[0];

        return j.between(scopeStart, scopeEnd)(valueStart);
    }

    function addVarEdit(varName, edits, coords) {
        var edit = {
            value: varName,
            coords: utilities.buildEsprimaCoords(coords)
        };

        return [edit].concat(edits);
    }

    function isTokenInScope(scopeIndices) {
        return function (__, index) {
            return j.between(scopeIndices.top, scopeIndices.bottom)(index)
        }
    }

    function getTokensInScope(scopeIndices, tokens) {
        return tokens.filter(isTokenInScope(scopeIndices));
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

    function getEdits(selectionData, scopeData, name) {
        var tokens = scopeData.tokens;
        var scopeIndices = scopeData.scopeIndices;
        var value = selectionData.selection[0];

        return getReplacementLocations(tokens, scopeIndices, value)
            .reduce(j.partial(addVarEdit, name), [])
            .map(adjustEdit);
    }

    function buildVariableString (name, selectionData){
        return templateUtils.templateFactory('newVariable')(name, selectionData);
    }

    return {
        addVarEdit: addVarEdit,
        adjustEdit: adjustEdit,
        buildVarCoords: buildVarCoords,
        buildVariableString: buildVariableString,
        getEdits: getEdits,
        getReplacementLocations: getReplacementLocations,
        getTokensInScope: getTokensInScope,
        isValueInScope: extensionHelper.returnOrDefault(false, isValueInScope)
    };
}

module.exports = extractVariableAction;