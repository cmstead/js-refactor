'use strict';

var vscode = require('vscode');

function buildTextEdit (coords, text) {
    var start = new vscode.Position(coords.start[0], coords.start[1]),
        end = new vscode.Position(coords.end[0], coords.end[1]),
        range = new vscode.Range(start, end);

    return new vscode.TextEdit(range, text);
}

function buildWorkspaceEdit () {
    return new vscode.WorkspaceEdit();
}

function buildSetEdit (uri, coords, text) {
    var edit = buildWorkspaceEdit();
    edit.set(uri, [buildTextEdit(coords, text)]);
    
    return edit;
}

function buildReplaceEdit (uri, coords, text) {
    var edit = buildWorkspaceEdit();
    edit.replace(uri, [buildTextEdit(coords, text)]);

    return edit
}

module.exports = {
    buildTextEdit: buildTextEdit,
    buildWorkspaceEdit: buildWorkspaceEdit,
    buildSetEdit: buildSetEdit,
    buildReplaceEdit: buildReplaceEdit
};