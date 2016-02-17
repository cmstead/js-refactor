'use strict';

var j = require('jfp');
var templates = require('../json/templates.json');
var utilities = require('../shared/utilities.js');

function getNewVariableContext(vsEditor, name, selectionData) {
    var documentIndent = utilities.getDocumentIndent(vsEditor);
    var lineIndent = utilities.getSelectionIndent([selectionData.selection[0]]);

    return {
        indent: lineIndent + documentIndent,
        name: name,
        value: selectionData.selection[0]
    };
}

function replaceKey (context, result, key){
    var pattern = new RegExp('\{' + key + '\}', 'g');
    return result.replace(pattern, context[key]);
}

function fillTemplate (template, context){
    return Object.keys(context).reduce(j.partial(replaceKey, context), template);
}

function templateFactory (templateName){
    return j.compose(
        j.partial(fillTemplate, templates[templateName]),
        getNewVariableContext
    );
}

module.exports = {
    getNewVariableContext: getNewVariableContext,
    fillTempalte: fillTemplate
}