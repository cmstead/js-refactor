'use strict';

var editActions = require('../shared/edit-actions');
var logger = require('../shared/logger-factory')();
var selectionFactory = require('../shared/selection-factory');
var templates = require('../json/templates.json');
var templateUtils = require('../shared/template-utils');
var utilities = require('../shared/utilities');

function applyRefactor(vsEditor, selection) {
    var coords = utilities.buildCoords(vsEditor, 0);
    var context = templateUtils.buildBaseContext(vsEditor, selection);
    var text = templateUtils.fillTemplate(templates.cond, context);

    return editActions.applySetEdit(vsEditor, text, coords);
}

function wrapInCondition(vsEditor, callback) {
    var selection = selectionFactory(vsEditor).getSelection(0);

    if (selection === null) {
        logger.info('Cannot wrap empty selection. To create a new if block, use the if (cond) snippet.');
    } else {
        applyRefactor(vsEditor, selection).then(callback);
    }
}

module.exports = wrapInCondition;