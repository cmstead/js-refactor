'use strict';

var editActionsFactory = require('../shared/edit-actions-factory');
var logger = require('../shared/logger-factory')();
var selectionFactory = require('../shared/selection-factory');
var templates = require('../json/templates.json');
var templateUtils = require('../shared/template-utils');
var utilities = require('../shared/utilities');

module.exports = function (vsEditor, callback) {
    var editActions = editActionsFactory(vsEditor);

    function cleanFunctionName(functionName) {
        return functionName.trim() === '' ? '' : functionName + ' ';
    }

    function updateCode(selection, functionName) {
        var contextExtension = { name: cleanFunctionName(functionName) };
        var context = templateUtils.buildExtendedContext(vsEditor, selection, contextExtension);

        var template = templates.function.concat(templates.functionCall);
        var text = templateUtils.fillTemplate(template, context);

        var coords = utilities.buildCoords(vsEditor, 0);

        return editActions.applySetEdit(text, coords);
    }

    return function wrapInExecutedFunction() {
        var selection = selectionFactory(vsEditor).getSelection(0);

        if (selection === null) {
            logger.info('Cannot wrap empty selection. To create a new function, use the function (fn) snippet.');
        } else {
            logger.input({ prompt: 'Name of your function' }, function (functionName) {
                updateCode(selection, functionName).then(callback);
            });
        }
    }

}
