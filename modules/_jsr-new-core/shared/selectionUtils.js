function selectionUtils () {
    
    function getSingleLineSelection(astCoords, sourceLines) {
        const startChar = astCoords.start.column;
        const endChar = astCoords.end.column - startChar;

        return sourceLines[astCoords.start.line - 1].substr(startChar, endChar);
    }

    function getMultilineSelection(astCoords, sourceLines) {
        const startLine = astCoords.start.line - 1;
        const endLine = astCoords.end.line;

        let selectedLines = sourceLines.slice(startLine, endLine);
        const lastIndex = selectedLines.length - 1;

        selectedLines[0] = selectedLines[0].substr(astCoords.start.column);
        selectedLines[lastIndex] = selectedLines[lastIndex].substr(0, astCoords.end.column);

        return selectedLines.join('\n');
    }

    function isSingleLineSelection(astCoords) {
        return astCoords.start.line === astCoords.end.line;
    }

    function getSelection(astCoords, sourceLines) {
        if(isSingleLineSelection(astCoords)) {
            return getSingleLineSelection(astCoords, sourceLines);
        } else {
            return getMultilineSelection(astCoords, sourceLines);
        }
    }

    return {
        getSelection
    };
}

module.exports = selectionUtils;