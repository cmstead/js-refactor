'use strict';

var j = require('jfp');
var templates = require('../json/templates.json');

function templateUtils(
    selectionFactory,
    utilities) {

    function getNewVariableContext(vsEditor, name, selectionData) {
        return {
            name: name,
            value: selectionData.selection[0]
        };
    }

    function replaceKey(context, result, key) {
        var pattern = new RegExp('\{' + key + '\}', 'g');
        return result.replace(pattern, context[key]);
    }

    function fillTemplate(template, context) {
        return Object.keys(context).reduce(j.partial(replaceKey, context), template.join('\n'));
    }

    function templateFactory(templateName) {
        return j.compose(
            j.partial(fillTemplate, templates[templateName]),
            getNewVariableContext
        );
    }

    function extendContext(context, extension) {
        return Object.keys(extension).reduce(function (context, key) {
            context[key] = extension[key];
            return context;
        }, context);
    }

    function buildBaseContext(vsEditor, selection) {
        var selectedLine = selectionFactory(vsEditor).getSelectionLine(0);

        return {
            body: selection.join('\n')
        };
    }

    function buildExtendedContext(vsEditor, selection, extension) {
        var context = buildBaseContext(vsEditor, selection);
        return extendContext(context, extension);
    }

    function getTemplate(templateName) {
        return templates[templateName];
    }


    return {
        buildBaseContext: buildBaseContext,
        buildExtendedContext: buildExtendedContext,
        fillTemplate: fillTemplate,
        getNewVariableContext: getNewVariableContext,
        getTemplate: getTemplate,
        templateFactory: templateFactory
    };
}

module.exports = templateUtils;