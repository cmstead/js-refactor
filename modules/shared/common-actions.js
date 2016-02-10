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

module.exports = {
    applyEdit: applyEdit,
    applyRefactor: applyRefactor,
    applyRefactorAtCoords: applyRefactorAtCoords,
    applyTemplateRefactor: applyTemplateRefactor
};