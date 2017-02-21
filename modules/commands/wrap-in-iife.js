'use strict';

var editActions = require('../shared/edit-actions');
var logger = require('../shared/logger-factory')();
var selectionFactory = require('../shared/selection-factory');
var templates = require('../json/templates.json');
var templateUtils = require('../shared/template-utils');
var utilities = require('../shared/utilities');

function updateCode(vsEditor, selection, functionName) {
    var context = templateUtils.buildBaseContext(vsEditor, selection);
    var coords = utilities.buildCoords(vsEditor, 0);
    var text = templateUtils.fillTemplate(templates.iife, context);

    return editActions.applySetEdit(vsEditor, text, coords);
}

function wrapInIIFE(vsEditor, callback) {
    var selection = selectionFactory(vsEditor).getSelection(0);

    if (selection === null) {
        logger.info('Cannot wrap empty selection. To create a new IIFE, use the IIFE (iife) snippet.');
    } else {
        updateCode(vsEditor, selection).then(callback);
    }
}

module.exports = wrapInIIFE;