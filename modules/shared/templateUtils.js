'use strict';

var j = require('jfp');
var templates = require('../json/templates.json');

function templateUtils() {

    function getNewVariableContext(name, varType, selectionData) {
        return {
            name: name,
            varType: varType,
            value: selectionData.selection[0]
        };
    }

    function replaceKey(context, result, key) {
        var pattern = new RegExp(`{${key}}`, 'g');
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

    function buildBaseContext(selection) {
        return {
            body: selection.join('\n')
        };
    }

    function buildExtendedContext(selection, extension) {
        var context = buildBaseContext(selection);
        return extendContext(context, extension);
    }

    function getTemplate(templateName) {
        return j.deref(templateName)(templates);
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