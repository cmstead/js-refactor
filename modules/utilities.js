'use strict';

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
    vsDocument._selections[index]._end._character = 0;
    vsDocument._selections[index]._end._line = endChar === 0 ? endLine : endLine + 1;

    return buildCoords(vsDocument, index);        
}

function endpointsEqual (coords) {
    var linesEqual = coords.start[0] === coords.end[0],
        pointsEqual = coords.start[1] === coords.end[1];
        
    return linesEqual && pointsEqual;
}

function indent (documentIndent, value) {
    var indentation = typeof documentIndent !== 'string' ? '\t' : documentIndent;
    return value.trim() === '' ? value : indentation + value;
}

function replaceKey (context, output, key) {
    return output.split('{' + key + '}').join(context[key]);
}

function fillTemplate (templateContext, templateString) {
    return Object.keys(templateContext).reduce(replaceKey.bind(null, templateContext), templateString);
}

function getSelectionIndent (selection) {
    return selection[0].split(/[^\s\t]/gim)[0];
}

function repeat (count, astr) {
    return count > 0 ? astr + repeat(count - 1, astr) : '';
}

function getDocumentIndent (vsEditor) {
    var tabSize = vsEditor.options.tabSize,
        useTabs = !vsEditor.options.insertSpaces;

    return useTabs ? '\t' : repeat(tabSize, ' ');
}

module.exports = {
    buildCoords: buildCoords,
    buildLineCoords: buildLineCoords,
    endpointsEqual: endpointsEqual,
    fillTemplate: fillTemplate,
    getDocumentIndent: getDocumentIndent,
    getSelectionIndent: getSelectionIndent,
    indent: indent,
    repeat: repeat,
    replaceKey: replaceKey
};