'use strict';

var logger = require('../shared/logger-factory')();
var actions = require('../shared/common-actions');
var utilities = require('../shared/utilities');
var selectionFactory = require('../shared/selection-factory');
var templates = require('../json/templates.json');

function updateCode (vsEditor, selection, functionName) {
    var documentIndent = utilities.getDocumentIndent(vsEditor),
        context = {
            name: functionName.trim() === '' ? '' : functionName + ' ',
            body: selection.map(utilities.indent.bind(null, documentIndent)).join('\n'),
            indent: utilities.getSelectionIndent(selection)
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