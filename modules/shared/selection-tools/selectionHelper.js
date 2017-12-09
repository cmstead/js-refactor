'use strict';

function selectionHelper(typeHelper) {

    function isEmptySelection(editorCoords) {
        return editorCoords.start[0] === editorCoords.end[0]
            && editorCoords.start[1] === editorCoords.end[1];
    }

    function isMultilineSelection(editorCoords) {
        return editorCoords.start[0] < editorCoords.end[0];
    }

    function getMultilineSelection(sourceLines, editorCoords) {
        const endCharIndex = editorCoords.end[1];
        const startCharIndex = editorCoords.start[1];

        let lines = sourceLines.slice(editorCoords.start[0], editorCoords.end[0] + 1);
        const lastLineIndex = lines.length - 1;

        lines[0] = lines[0].slice(startCharIndex);
        lines[lastLineIndex] = lines[lastLineIndex].slice(0, endCharIndex);

        return lines;
    }

    function getSingleLineSelection(sourceLines, editorCoords) {
        const line = sourceLines[editorCoords.start[0]];

        const startIndex = editorCoords.start[1];
        const indexOffset = editorCoords.end[1] - editorCoords.start[1];

        return [line.substr(startIndex, indexOffset)];
    }

    function getEmptySelection() {
        return [''];
    }

    function getSelection(sourceLines, editorCoords) {
        const getSelectionAction = isMultilineSelection(editorCoords)
            ? getMultilineSelection
            : getSingleLineSelection;

        return isEmptySelection(editorCoords) 
            ? getEmptySelection() 
            : getSelectionAction(sourceLines, editorCoords);
    }


    return {
        getSelection: typeHelper.enforce(
            'sourceLines, editorCoords => sourceLines',
            getSelection),

        isEmptySelection: typeHelper.enforce(
            'editorCoords => boolean',
            isEmptySelection),

        isMultilineSelection: typeHelper.enforce(
            'editorCoords => boolean',
            isMultilineSelection)
    };

}

module.exports = selectionHelper;