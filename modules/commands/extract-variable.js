'use strict';

var actions = require('../shared/common-actions');
var esprima = require('esprima');
var functionScopeUtil = require('../shared/function-scope-util');
var j = require('jfp');
var logger = require('../shared/logger-factory')();
var selectionFactory = require('../shared/selection-factory');
var templates = require('../json/templates.json');
var utilities = require('../shared/utilities');

function getSourceTokens(vsEditor) {
    var src = utilities.getEditorDocument(vsEditor)._lines.join('\n');
    return esprima.tokenize(src, { loc: true });
}

function isValueInScope(scopeBounds, valueCoords) {
    var scopeStart = scopeBounds.start;
    var scopeEnd = scopeBounds.end;
    var valueStart = valueCoords.start;

    return j.leq(scopeStart[0], valueStart[0]) && j.leq(valueStart[0], scopeEnd[0]);
}

function extractVariable(vsEditor, selectionData, scopeData) {
    logger.info('Next step: extract variable.');
    //actions.applyTemplateRefactor(vsEditor, selection, context, templates.function.join('\n'));
}

function selectionDataFactory(vsEditor) {
    return {
        selection: selectionFactory(vsEditor).getSelection(0),
        selectionCoords: utilities.buildCoords(vsEditor, 0)
    };
}

function scopeDataFactory(vsEditor, selectionData) {
    var tokens = getSourceTokens(vsEditor);
    var scopeIndices = functionScopeUtil.findScopeIndices(tokens, selectionData.selectionCoords);
    var scopeBounds = functionScopeUtil.buildBoundsObject(tokens, scopeIndices.top, scopeIndices.bottom);

    return {
        tokens: tokens,
        scopeIndices: scopeIndices,
        scopeBounds: scopeBounds
    };
}

function wrapInFunction(vsEditor) {
    var selectionData = selectionDataFactory(vsEditor);
    var scopeData = scopeDataFactory(vsEditor, selectionData);

    var extract = j.partial(extractVariable, vsEditor, selectionData, scopeData);

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

module.exports = wrapInFunction;