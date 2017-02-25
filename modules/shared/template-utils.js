'use strict';

var j = require('jfp');
var selectionFactory = require('./selectionFactory')();
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
    return Object.keys(context).reduce(j.partial(replaceKey, context), template.join('\n'));
}

function templateFactory (templateName){
    return j.compose(
        j.partial(fillTemplate, templates[templateName]),
        getNewVariableContext
    );
}

function extendContext (context, extension){
    return Object.keys(extension).reduce(function (context, key) {
        context[key] = extension[key];
        return context; }, context);
}

function buildBaseContext (vsEditor, selection){
    var selectedLine = selectionFactory(vsEditor).getSelectionLine(0);
    var documentIndent = utilities.getDocumentIndent(vsEditor);
    var lineIndent = utilities.getSelectionIndent([selectedLine]);

    return {
        documentIndent: documentIndent,
        lineIndent: lineIndent,
        body: selection.map(utilities.indent.bind(null, lineIndent + documentIndent)).join('\n'),
        indent: lineIndent
    };    
}

function buildExtendedContext (vsEditor, selection, extension) {
    var context = buildBaseContext(vsEditor, selection);
    return extendContext(context, extension);
}


module.exports = {
    buildBaseContext: buildBaseContext,
    buildExtendedContext: buildExtendedContext,
    fillTemplate: fillTemplate,
    getNewVariableContext: getNewVariableContext,
	templateFactory: templateFactory
}