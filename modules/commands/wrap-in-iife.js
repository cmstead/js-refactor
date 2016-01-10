'use strict';

var logger = require('../logger-factory')(),
    actions = require('../common-actions'),
    selectionFactory = require('../selection-factory'),
    templates = require('../json/templates.json');

function updateCode (vsEditor, selection, functionName) {
    var context = {
        body: selection.map(actions.indent).join('\n')
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