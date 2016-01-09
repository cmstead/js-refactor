'use strict'

var vscode = require('vscode');

function textEditFactory (coords, text) {
    var start = new vscode.Position(coords.start[0], coords.start[1]),
        end = new vscode.Position(coords.end[0], coords.end[1]),
        range = new vscode.Range(start, end);

    return new vscode.TextEdit(range, text);
}

function addLine () {
    var activeDoc = vscode.window.activeTextEditor._document,
        coords = { start: [0, 0], end: [0, 0]},
        textValue = 'foo\nbar\nbaz\n',
        
        textEdit = textEditFactory(coords, textValue),
        edit = new vscode.WorkspaceEdit();
    
    edit.set(activeDoc._uri, [textEdit]);
    vscode.workspace.applyEdit(edit);
}

module.exports = addLine;