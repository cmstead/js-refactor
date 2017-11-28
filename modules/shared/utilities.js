'use strict';

var j = require('jfp');

function utilities() {

    function buildCoords(vsDocument, index) {
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

    function getEditorDocument(vsEditor) {
        return j.eitherObject(vsEditor._documentData)(vsEditor._document);
    }

    function getDocumentLines(vsEditor) {
        return getEditorDocument(vsEditor)._lines;
    }

    function getAllSelectionCoords(vsEditor) {
        return vsEditor._selections;
    }

    return {
        buildCoords: buildCoords,
        getAllSelectionCoords: getAllSelectionCoords,
        getDocumentLines: getDocumentLines,
        getEditorDocument: getEditorDocument
    };
}

module.exports = utilities;