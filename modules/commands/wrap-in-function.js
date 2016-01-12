'use strict';

var logger = require('../logger-factory')(),
    actions = require('../common-actions'),
    selectionFactory = require('../selection-factory'),
    templates = require('../json/templates.json');

function updateCode (vsEditor, selection, functionName) {
    var documentIndent = actions.getDocumentIndent(vsEditor),
        context = {
            name: functionName.trim() === '' ? '' : functionName + ' ',
            body: selection.map(actions.indent.bind(null, documentIndent)).join('\n'),
            indent: actions.getSelectionIndent(selection)
        };
    
    actions.applyTemplateRefactor(vsEditor, selection, context, templates.function);
}

function wrapInFunction (vsEditor) {
    var selection = selectionFactory(vsEditor).getSelection(0);

    if (selection === null) {
        logger.info('Cannot wrap empty selection. To create a new function, use the function (fn) snippet.');
    } else {
        logger.input({ prompt: 'Name of your function' }, updateCode.bind(null, vsEditor, selection));
    }
}

module.exports = wrapInFunction;