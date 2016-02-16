'use strict';

var vscode = require('vscode');
var j = require('jfp');
var logger = require('./logger-factory')();
var editFactory = require('./edit-factory');
var utilities = require('./utilities');

function applyEdit (edit) {
    vscode.workspace.applyEdit(edit);
}

function applyRefactorAtCoords (vsEditor, update, coords) {
    applyEdit(editFactory.buildSetEdit(utilities.getEditorDocument(vsEditor)._uri, coords, update));
}

function applyRefactor (vsEditor, update){
    applyRefactorAtCoords(vsEditor, update, utilities.buildCoords(vsEditor, 0));
}

function applyTemplateRefactor (vsEditor, selection, context, template) {
    applyRefactor(vsEditor, utilities.fillTemplate(context, template));
}

function applyMultipleRefactors (vsEditor, edits){
    applyEdit(editFactory.buildMultipleSetEdits(utilities.getEditorDocument(vsEditor)._uri, edits));
}

module.exports = {
    applyEdit: applyEdit,
    applyMultipleRefactors: applyMultipleRefactors,
    applyRefactor: applyRefactor,
    applyRefactorAtCoords: applyRefactorAtCoords,
    applyTemplateRefactor: applyTemplateRefactor
};