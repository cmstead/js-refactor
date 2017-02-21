'use strict';

var editFactory = require('./edit-factory');
var utilities = require('./utilities');
var vscodeFactory = require('./vscodeFactory');

function applyEdit (edit) {
    return vscodeFactory.get().workspace.applyEdit(edit);
}

function getUri (vsEditor){
    return utilities.getEditorDocument(vsEditor)._uri;
}

function applySetEdit (vsEditor, content, coords) {
    var uri = getUri(vsEditor);
    var textEdit = editFactory.buildSetEdit(uri, coords, content);
    
    return applyEdit(textEdit);
}

function applyReplaceEdit (vsEditor, content, coords) {
    var uri = getUri(vsEditor);
    var textEdit = editFactory.buildSetEdit(uri, coords, content);
    
    return applyEdit(textEdit);
}

function applySetEdits (vsEditor, edits){
    var uri = getUri(vsEditor);
    var textEdit = editFactory.buildMultipleSetEdits(uri, edits);
    
    return applyEdit(textEdit);
}

function applyReplaceEdits (vsEditor, edits){
    var uri = getUri(vsEditor);
    var textEdit = editFactory.buildMultipleSetEdits(uri, edits);
    
    return applyEdit(textEdit);
}

module.exports = {
    applySetEdit: applySetEdit,
    applyReplaceEdit: applyReplaceEdit,
    applySetEdits: applySetEdits,
    applyReplaceEdits: applyReplaceEdits
};