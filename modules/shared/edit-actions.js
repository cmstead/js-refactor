'use strict';

var editFactory = require('./edit-factory');
var utilities = require('./utilities');
var vscode = require('vscode');

function applyEdit (edit) {
    vscode.workspace.applyEdit(edit);
}

function getUri (vsEditor){
    return utilities.getEditorDocument(vsEditor)._uri;
}

function applySetEdit (vsEditor, content, coords) {
    var uri = getUri(vsEditor);
    var textEdit = editFactory.buildSetEdit(uri, coords, content);
    
    applyEdit(textEdit);
}

function applyReplaceEdit (vsEditor, content, coords) {
    var uri = getUri(vsEditor);
    var textEdit = editFactory.buildSetEdit(uri, coords, content);
    
    applyEdit(textEdit);
}

function applySetEdits (vsEditor, edits){
    var uri = getUri(vsEditor);
    var textEdit = editFactory.buildMultipleSetEdits(uri, edits);
    
    applyEdit(textEdit);
}

function applyReplaceEdits (vsEditor, edits){
    var uri = getUri(vsEditor);
    var textEdit = editFactory.buildMultipleSetEdits(uri, edits);
    
    applyEdit(textEdit);
}

module.exports = {
    applySetEdit: applySetEdit,
    applyReplaceEdit: applyReplaceEdit,
    applySetEdits: applySetEdits,
    applyReplaceEdits: applyReplaceEdits
};