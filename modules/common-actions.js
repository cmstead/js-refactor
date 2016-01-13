'use strict';

var vscode = require('vscode'),
    logger = require('./logger-factory')(),
    editFactory = require('./edit-factory'),
    utilities = require('./utilities');

function applyEdit (edit) {
    vscode.workspace.applyEdit(edit);
}

function applyTemplateRefactor (vsEditor, selection, context, template) {
    applyEdit(editFactory.buildSetEdit(vsEditor._document._uri,
                                       utilities.buildLineCoords(vsEditor, 0), 
                                       utilities.fillTemplate(context, template)));
}

module.exports = {
    applyEdit: applyEdit,
    applyTemplateRefactor: applyTemplateRefactor,
    buildCoords: utilities.buildCoords,
    buildLineCoords: utilities.buildLineCoords,
    endpointsEqual: utilities.endpointsEqual,
    fillTemplate: utilities.fillTemplate,
    getDocumentIndent: utilities.getDocumentIndent,
    getSelectionIndent: utilities.getSelectionIndent,
    indent: utilities.indent
};