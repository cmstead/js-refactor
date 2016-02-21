'use strict';

var editActions = require('../shared/edit-actions');
var logger = require('../shared/logger-factory')();
var selectionFactory = require('../shared/selection-factory');
var templates = require('../json/templates.json');
var templateUtils = require('../shared/template-utils');
var utilities = require('../shared/utilities');

function updateCode(vsEditor, selection, functionName) {
    var documentIndent = utilities.getDocumentIndent(vsEditor);
    var selectedLine = selectionFactory(vsEditor).getSelectionLine(0);
    var lineIndent = utilities.getSelectionIndent([selectedLine]);
    var coords = utilities.buildCoords(vsEditor, 0);

    var context = {
        body: selection.map(utilities.indent.bind(null, lineIndent + documentIndent)).join('\n'),
        indent: lineIndent
    };

    var text = templateUtils.fillTemplate(templates.cond, context);

    editActions.applySetEdit(vsEditor, text, coords);
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