'use strict';

var j = require('jfp');

function buildEsprimaCoords (coords){
    return {
        start: [coords.start.line, coords.start.column],
        end: [coords.end.line, coords.end.column],
    };
}

function buildCoords (vsDocument, index) {
    return {
        start: [
            vsDocument._selections[index]._start._line,
            vsDocument._selections[index]._start._character
        ],
        end: [
            vsDocument._selections[index]._end._line,
            vsDocument._selections[index]._end._character
        ]
    };
}

function indent (documentIndent, value) {
    var indentation = typeof documentIndent !== 'string' ? '\t' : documentIndent;
    var trimmedValue = j.either('', value, 'string').trim();
    
    return trimmedValue === '' ? trimmedValue : indentation + trimmedValue;
}

function getSelectionIndent (selection) {
    return selection[0].split(/[^\s\t]/gim)[0];
}

function getDocumentIndent (vsEditor) {
    var tabSize = vsEditor.options.tabSize,
        useTabs = !vsEditor.options.insertSpaces;

    return useTabs ? '\t' : j.repeat(tabSize, ' ');
}

function getEditorDocument (vsEditor){
    return j.either(vsEditor._documentData, vsEditor._document);
}

module.exports = {
    buildCoords: buildCoords,
    buildEsprimaCoords: buildEsprimaCoords,
    getDocumentIndent: getDocumentIndent,
    getEditorDocument: getEditorDocument,
    getSelectionIndent: getSelectionIndent,
    indent: indent
};