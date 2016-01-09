'use strict';

var vscode = require('vscode'),
    logger = require('./logger-factory')();

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

module.exports = {
    applyEdit: applyEdit,
    buildCoords: buildCoords,
    buildLineCoords: buildLineCoords,
    endpointsEqual: endpointsEqual
};