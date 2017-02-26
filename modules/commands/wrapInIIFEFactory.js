'use strict';

var templates = require('../json/templates.json');
var templateUtils = require('../shared/template-utils');


function wrapInIIFEFactory(
    logger, 
    selectionFactory,
    utilities,
    editActionsFactory) {

    return function (vsEditor, callback) {
        var editActions = editActionsFactory(vsEditor);

        function updateCode(selection, functionName) {
            var context = templateUtils.buildBaseContext(vsEditor, selection);
            var coords = utilities.buildCoords(vsEditor, 0);
            var text = templateUtils.fillTemplate(templates.iife, context);

            return editActions.applySetEdit(text, coords);
        }

        return function wrapInIIFE() {
            var selection = selectionFactory(vsEditor).getSelection(0);

            if (selection === null) {
                logger.info('Cannot wrap empty selection. To create a new IIFE, use the IIFE (iife) snippet.');
            } else {
                updateCode(selection).then(callback);
            }
        }

    }

}

wrapInIIFEFactory['@dependencies'] = [
    'logger',
    'selectionFactory',
    'utilities',
    'editActionsFactory'
];

module.exports = wrapInIIFEFactory;