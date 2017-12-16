'use strict';

var j = require('jfp');

function wrapInTemplateAction(
    templateUtils) {

    function wrapSelection(templates, selection, contextExtension) {
        var template = templates.reduce(concatTemplates, []);
        var context = templateUtils.buildExtendedContext(selection, j.eitherObject({})(contextExtension));

        return templateUtils.fillTemplate(template, context);
    }

    function concatTemplates(result, templateName) {
        var template = templateUtils.getTemplate(templateName);
        return result.concat(template);
    }

    return {
        wrapSelection: wrapSelection
    };

}

module.exports = wrapInTemplateAction;