'use strict';

var vscode = require('vscode'),
    logger = require('./logger-factory')(),
    editFactory = require('./edit-factory'),
    utilities = require('./utilities');

function applyEdit (edit) {
    vscode.workspace.applyEdit(edit);
}

function applyRefactor (vsEditor, update){
    applyEdit(editFactory.buildSetEdit(vsEditor._document._uri,
                                       utilities.buildCoords(vsEditor, 0), 
                                       update));
}

function applyTemplateRefactor (vsEditor, selection, context, template) {
    applyRefactor(vsEditor, utilities.fillTemplate(context, template));
}

module.exports = {
    applyEdit: applyEdit,
    applyRefactor: applyRefactor,
    applyTemplateRefactor: applyTemplateRefactor,
    buildCoords: utilities.buildCoords,
    buildLineCoords: utilities.buildLineCoords,
    endpointsEqual: utilities.endpointsEqual,
    fillTemplate: utilities.fillTemplate,
    getDocumentIndent: utilities.getDocumentIndent,
    getSelectionIndent: utilities.getSelectionIndent,
    indent: utilities.indent
};