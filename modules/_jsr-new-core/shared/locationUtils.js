function locationUtils (
    types
) {
    
    function convertToAstLocation(editorCoordinates) {
        return {
            start: {
                line: editorCoordinates._start._line + 1,
                column: editorCoordinates._start._character
            },
            end: {
                line: editorCoordinates._end._line + 1,
                column: editorCoordinates._end._character
            }
        }
    }

    function convertToEditorLocation(astCoordinates) {
        return {
            _start: {
                _line: astCoordinates.start.line - 1,
                _character: astCoordinates.start.column
            },
            _end: {
                _line: astCoordinates.end.line - 1,
                _character: astCoordinates.end.column
            }
        }
    }

    function isLocationAnEmptySelection(astCoordinates) {
        return astCoordinates.start.line === astCoordinates.end.line
            && astCoordinates.start.column === astCoordinates.end.column;
    }

    return {
        convertToAstLocation: types.enforce(
            'editorLocation => astLocation',
            convertToAstLocation
        ),
        convertToEditorLocation: types.enforce(
            'astLocation => editorLocation',
            convertToEditorLocation
        ),
        isLocationAnEmptySelection: types.enforce(
            'astLocation => boolean',
            isLocationAnEmptySelection
        )
    };
}

module.exports = locationUtils;