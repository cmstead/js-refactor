'use strict';

var vscode = require('vscode');
var j = require('jfp');

function buildTextEdit (coords, text) {
    var start = new vscode.Position(coords.start[0], coords.start[1]),
        end = new vscode.Position(coords.end[0], coords.end[1]),
        range = new vscode.Range(start, end);

    return new vscode.TextEdit(range, text);
}

function buildWorkspaceEdit () {
    return new vscode.WorkspaceEdit();
}

// Builds a "set" type edit object to update the view
function buildSetEdit (uri, coords, text) {
    var edit = buildWorkspaceEdit();
    edit.set(uri, [buildTextEdit(coords, text)]);
    
    return edit;
}

// Builds a "replace" type edit object to update the view
function buildReplaceEdit (uri, coords, text) {
    var edit = buildWorkspaceEdit();
    edit.replace(uri, [buildTextEdit(coords, text)]);

    return edit
}

function buildMultipleSetEdits (uri, edits){
    var textEdits = edits.reduce(function (list, edit) { return j.conj(buildTextEdit(edit.coords, edit.value), list); }, []);
    var edit = buildWorkspaceEdit();
    
    edit.set(uri, textEdits);
    
    return edit;
}

module.exports = {
    buildMultipleSetEdits: buildMultipleSetEdits,
    buildTextEdit: buildTextEdit,
    buildWorkspaceEdit: buildWorkspaceEdit,
    buildSetEdit: buildSetEdit,
    buildReplaceEdit: buildReplaceEdit
};