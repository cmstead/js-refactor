'use strict';

var vscode = require('vscode'),
    logger = require('./logger-factory')(),
    editFactory = require('./edit-factory');

function applyEdit (edit) {
    vscode.workspace.applyEdit(edit);
}

function buildCoords (vsDocument, index) {
    return {
        start: [
            vsDocument._selections[index]._start._line,
            vsDocument._selections[index]._start._character
        ],
        end: [
            vsDocument._selections[index]._end._line,
            vsDocument._selections[index]._end._character
        ]
    };
}

function buildLineCoords (vsDocument, index) {
    var endChar = vsDocument._selections[index]._end._character,
        endLine = vsDocument._selections[index]._end._line;

    vsDocument._selections[index]._start._character = 0;
    vsDocument._selections[index]._end._line = endChar === 0 ? endLine : endLine + 1;

    return buildCoords(vsDocument, index);        
}

function endpointsEqual (coords) {
    var linesEqual = coords.start[0] === coords.end[0],
        pointsEqual = coords.start[1] === coords.end[1];
        
    return linesEqual && pointsEqual;
}

function indent (value) {
    return value.trim() === '' ? value : '\t' + value;
}

function replaceKey (context, output, key) {
    return output.replace('{' + key + '}', context[key]);
}

function fillTemplate (templateContext, templateString) {
    return Object.keys(templateContext).reduce(replaceKey.bind(null, templateContext), templateString);
}

function applyTemplateRefactor (vsEditor, selection, context, template) {
    applyEdit(editFactory.buildSetEdit(vsEditor._document._uri,
                                       buildLineCoords(vsEditor, 0), 
                                       fillTemplate(context, template)));
}

module.exports = {
    applyEdit: applyEdit,
    applyTemplateRefactor: applyTemplateRefactor,
    buildCoords: buildCoords,
    buildLineCoords: buildLineCoords,
    endpointsEqual: endpointsEqual,
    fillTemplate: fillTemplate,
    indent: indent
};