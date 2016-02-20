'use strict';

var vscode = require('vscode');
var j = require('jfp');

function positionFactory (line, column){
    return new vscode.Position(line, column);
}

// This will be important as coordinate object is converted to new format
function positionFactoryFacade (location) {
    return positionFactory(location[0], location[1]);
}

function rangeFactory (start, end){
    var startPosition = positionFactoryFacade(start);
    var endPosition = positionFactoryFacade(end);
    
    return new vscode.Range(startPosition, endPosition);
}

function textEditFactory (coords, content){
    var range = rangeFactory(coords.start, coords.end);
    return new vscode.TextEdit(range, content);
}

function workspaceEditFactory () {
    return new vscode.WorkspaceEdit();
}

function setEditFactory (uri, edits){
    var edit = workspaceEditFactory();
    
    edit.set(uri, edits);
    
    return edit;
}

function replaceEditFactory (uri, edits){
    var edit = workspaceEditFactory();
    
    edit.replace(uri, edits);
    
    return edit;
}

// Composite construction functions

// Builds a "set" type edit object to update the view
function buildSetEdit (uri, coords, text) {
    var textEdit = textEditFactory(coords, text);
    return setEditFactory(uri, [textEdit]);
}

// Builds a "replace" type edit object to update the view
function buildReplaceEdit (uri, coords, text) {
    var textEdit = textEditFactory(coords, text);
    return replaceEditFactory(uri, [textEdit]);
}

function buildMultipleSetEdits (uri, edits){
    var textEdits = edits.map(function (edit) { return textEditFactory(edit.coords, edit.value); });
    return setEditFactory(uri, textEdits);
}

function buildMultipleReplaceEdits (uri, edits){
    var textEdits = edits.map(function (edit) { return textEditFactory(edit.coords, edit.value); });
    return replaceEditFactory(uri, textEdits);
}

module.exports = {
    buildMultipleSetEdits: buildMultipleSetEdits,
    buildSetEdit: buildSetEdit,
    buildMultipleReplaceEdits: buildMultipleSetEdits,
    buildReplaceEdit: buildSetEdit
};