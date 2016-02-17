'use strict';

var esprima = require('esprima');
var functionScopeUtil = require('./function-scope-util');
var selectionFactory = require('../shared/selection-factory');
var utilities = require('./utilities');

function getSourceTokens(vsEditor) {
    var src = utilities.getEditorDocument(vsEditor)._lines.join('\n');
    return esprima.tokenize(src, { loc: true });
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

function selectionDataFactory(vsEditor) {
    return {
        selection: selectionFactory(vsEditor).getSelection(0),
        selectionCoords: utilities.buildCoords(vsEditor, 0)
    };
}

module.exports = {
    getSourceTokens: getSourceTokens,
    scopeDataFactory: scopeDataFactory,
    selectionDataFactory: selectionDataFactory,
}