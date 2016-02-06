'use strict';

var vscode = require('vscode'),
    logger = require('./logger-factory')(),
    editFactory = require('./edit-factory'),
    utilities = require('./utilities');

function applyEdit (edit) {
    vscode.workspace.applyEdit(edit);
}

function applyRefactorAtCoords (vsEditor, update, coords) {
    applyEdit(editFactory.buildSetEdit(vsEditor._document._uri, coords, update));
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
    applyTemplateRefactor: applyTemplateRefactor,
    buildCoords: utilities.buildCoords,
    buildLineCoords: utilities.buildLineCoords,
    endpointsEqual: utilities.endpointsEqual,
    fillTemplate: utilities.fillTemplate,
    getDocumentIndent: utilities.getDocumentIndent,
    getSelectionIndent: utilities.getSelectionIndent,
    indent: utilities.indent
};