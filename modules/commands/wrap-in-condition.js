'use strict';

var logger = require('../shared/logger-factory')(),
    actions = require('../shared/common-actions'),
    selectionFactory = require('../shared/selection-factory'),
    templates = require('../json/templates.json');

function updateCode (vsEditor, selection, functionName) {
    var documentIndent = actions.getDocumentIndent(vsEditor),
        context = {
            body: selection.map(actions.indent.bind(null, documentIndent)).join('\n'),
            indent: actions.getSelectionIndent(selection)
        };
    
    actions.applyTemplateRefactor(vsEditor, selection, context, templates.cond);
}

function wrapInCondition (vsEditor) {
    var selection = selectionFactory(vsEditor).getSelection(0);

    if (selection === null) {
        logger.info('Cannot wrap empty selection. To create a new if block, use the if (cond) snippet.');
    } else {
        updateCode(vsEditor, selection);
    }
}

module.exports = wrapInCondition;