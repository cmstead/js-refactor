function selectionUtils(
    types
) {

    function getSelectedLines(astCoords, sourceLines) {
        const startLine = astCoords.start.line - 1;
        const endLine = astCoords.end.line;

        return sourceLines.slice(startLine, endLine);
    }

    function trimToSelection(astCoords, selectedLines) {
        const startColumn = astCoords.start.column;
        const endColumn = astCoords.end.column;
        const lastIndex = selectedLines.length - 1;

        selectedLines[lastIndex] = selectedLines[lastIndex].substr(0, endColumn);
        selectedLines[0] = selectedLines[0].substr(startColumn);

        return selectedLines;
    }

    function getSelectedSource(astCoords, sourceLines) {
        let selectedLines = getSelectedLines(astCoords, sourceLines);

        return trimToSelection(astCoords, selectedLines);
    }

    function getSelection(astCoords, sourceLines) {
        return getSelectedSource(astCoords, sourceLines).join('\n');
    }

    function getFirstLine(astCoords, sourceLines) {
        return getSelectedSource(astCoords, sourceLines)[0];
    }

    return {
        getFirstLine: types.enforce(
            'astLocation, array<string> => string',
            getFirstLine
        ),
        getSelection: types.enforce(
            'astLocation, array<string> => string',
            getSelection
        )
    };
}

module.exports = selectionUtils;