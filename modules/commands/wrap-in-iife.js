'use strict';

var logger = require('../shared/logger-factory')();
var actions = require('../shared/common-actions');
var utilities = require('../shared/utilities');
var selectionFactory = require('../shared/selection-factory');
var templates = require('../json/templates.json');

function updateCode (vsEditor, selection, functionName) {
    var documentIndent = actions.getDocumentIndent(vsEditor),
        context = {
            body: selection.map(utilities.indent.bind(null, documentIndent)).join('\n'),
            indent: utilities.getSelectionIndent(selection)
        };
    
    actions.applyTemplateRefactor(vsEditor, selection, context, templates.iife);
}

function wrapInIIFE (vsEditor) {
    var selection = selectionFactory(vsEditor).getSelection(0);

    if (selection === null) {
        logger.info('Cannot wrap empty selection. To create a new IIFE, use the IIFE (iife) snippet.');
    } else {
        updateCode(vsEditor, selection);
    }
}

module.exports = wrapInIIFE;