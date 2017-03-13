'use strict';

function wrapInIIFEFactory(
    logger,
    selectionFactory,
    utilities,
    templateUtils,
    editActionsFactory) {

    var iifeTemplate = templateUtils.getTemplate('iife');

    return function (vsEditor, callback) {
        var editActions = editActionsFactory(vsEditor);

        function updateCode(selection, functionName) {
            var context = templateUtils.buildBaseContext(selection);
            var coords = utilities.buildCoords(vsEditor, 0);
            var text = templateUtils.fillTemplate(iifeTemplate, context);

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

module.exports = wrapInIIFEFactory;