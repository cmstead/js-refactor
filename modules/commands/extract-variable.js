'use strict';

var actions = require('../shared/common-actions');
var functionScopeUtil = require('../shared/function-scope-util');
var j = require('jfp');
var logger = require('../shared/logger-factory')();
var sourceUtils = require('../shared/source-utils');
var templateUtils = require('../shared/template-utils');
var utilities = require('../shared/utilities');

function between (start, end, value){
    return j.leq(start, value) && j.leq(value, end);
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

    return j.cons(edit, edits);
}

function getTokensInScope(scopeIndices, tokens) {
    return tokens.filter(function (__, index) { return between(scopeIndices.top, scopeIndices.bottom, index)});
}

function getMatchLocations(value, tokens) {
    return tokens.filter(function (token) { return token.value === value; })
                 .map(j('pick', 'loc'));
}

function getReplacementLocations(tokens, scopeIndices, value) {
    var edits = getTokensInScope(scopeIndices, tokens);
    edits = getMatchLocations(value, edits);
    return edits;
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

function adjustEdit (edit){
    edit.coords.start[0] -= 1;
    edit.coords.end[0] -= 1;
    
    return edit;
}

function extractVariable(vsEditor, selectionData, scopeData, name) {
    var tokens = scopeData.tokens;
    var scopeIndices = scopeData.scopeIndices;
    var value = selectionData.selection[0];
    var varCoords = buildVarCoords(scopeData);

    var edits = getReplacementLocations(tokens, scopeIndices, value).reduce(j.partial(addVarEdit, name), []).map(adjustEdit);
    var variableString = templateUtils.templateFactory('newVariable')(vsEditor, name, selectionData);

    actions.applyMultipleRefactors(vsEditor, edits);
    actions.applyRefactorAtCoords(vsEditor, variableString, varCoords);
}

function extractAction(vsEditor) {
    var selectionData = sourceUtils.selectionDataFactory(vsEditor);
    var scopeData = sourceUtils.scopeDataFactory(vsEditor, selectionData);
    var extract = j(extractVariable, vsEditor, selectionData, scopeData);

    if (selectionData.selection === null) {
        logger.info('Cannot extract empty selection as a variable');
    } else if (selectionData.selection.length > 1) {
        logger.info('Extract varialble does not currently support multiline values');
    } else if (!isValueInScope(scopeData.scopeBounds, selectionData.selectionCoords)) {
        logger.info('Cannot extract variable if it is not inside a function');
    } else {
        logger.input({ prompt: 'Name of your variable' }, extract);
    }
}

module.exports = extractAction;