'use strict';

var logger = require('../logger-factory')(),
    actions = require('../common-actions'),
    selectionFactory = require('../selection-factory'),
    templates = require('../json/templates.json');

function updateCode (vsEditor, selection, functionName) {
    var template = templates.function + templates.functionCall,
        context = {
            name: functionName.trim() === '' ? '' : functionName + ' ',
            body: selection.map(actions.indent).join('\n')
        };
    
    actions.applyTemplateRefactor(vsEditor, selection, context, template);
}

function extractToFunction (vsEditor) {
    var selection = selectionFactory(vsEditor).getSelection(0);

    if (selection === null) {
        logger.info('Cannot wrap empty selection. To create a new function, use the function (fn) snippet.');
    } else {
        logger.input({ prompt: 'Name of your function' }, updateCode.bind(null, vsEditor, selection));
    }
}

module.exports = extractToFunction;