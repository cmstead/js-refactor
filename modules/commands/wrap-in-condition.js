'use strict';

var logger = require('../shared/logger-factory')();
var actions = require('../shared/common-actions');
var utilities = require('../shared/utilities');
var selectionFactory = require('../shared/selection-factory');
var templates = require('../json/templates.json');

function updateCode(vsEditor, selection, functionName) {
    var documentIndent = utilities.getDocumentIndent(vsEditor),
        selectedLine = selectionFactory(vsEditor).getSelectionLine(0),
        lineIndent = utilities.getSelectionIndent([selectedLine]),
        
        context = {
            body: selection.map(utilities.indent.bind(null, lineIndent + documentIndent)).join('\n'),
            indent: lineIndent 
        };

    actions.applyTemplateRefactor(vsEditor, selection, context, templates.cond.join('\n'));
}

function wrapInCondition(vsEditor) {
    var selection = selectionFactory(vsEditor).getSelection(0);

    if (selection === null) {
        logger.info('Cannot wrap empty selection. To create a new if block, use the if (cond) snippet.');
    } else {
        updateCode(vsEditor, selection);
    }
}

module.exports = wrapInCondition;