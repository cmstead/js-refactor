'use strict';

var logger = require('../shared/logger-factory')();
var actions = require('../shared/common-actions');
var selectionFactory = require('../shared/selection-factory');
var utilities = require('../shared/utilities');
var templates = require('../json/templates.json');

function updateCode (vsEditor, selection, functionName) {
    var documentIndent = utilities.getDocumentIndent(vsEditor),
        template = templates.function.concat(templates.functionCall),
        selectedLine = selectionFactory(vsEditor).getSelectionLine(0),
        lineIndent = utilities.getSelectionIndent([selectedLine]),
        
        context = {
            name: functionName.trim() === '' ? '' : functionName + ' ',
            body: selection.map(utilities.indent.bind(null, lineIndent + documentIndent)).join('\n'),
            indent: lineIndent
        };
    
    actions.applyTemplateRefactor(vsEditor, selection, context, template.join('\n'));
}

function wrapInExecutedFunction (vsEditor) {
    var selection = selectionFactory(vsEditor).getSelection(0);

    if (selection === null) {
        logger.info('Cannot wrap empty selection. To create a new function, use the function (fn) snippet.');
    } else {
        logger.input({ prompt: 'Name of your function' }, updateCode.bind(null, vsEditor, selection));
    }
}

module.exports = wrapInExecutedFunction;