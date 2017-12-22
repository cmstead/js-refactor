'use strict';

function coordsHelper(
    typeHelper,
    arrayUtils
) {

    function coordsFromDocumentToEditor(documentCoords) {
        return {
            start: [
                documentCoords._start._line,
                documentCoords._start._character
            ],
            end: [
                documentCoords._end._line,
                documentCoords._end._character
            ]
        }
    }

    function coordsFromEditorToDocument(editorCoords) {
        return {
            _start: {
                _line: editorCoords.start[0],
                _character: editorCoords.start[1],
            },
            _end: {
                _line: editorCoords.end[0],
                _character: editorCoords.end[1],
            }
        };
    }

    function coordsFromEditorToAst(editorCoords) {
        return {
            start: {
                line: editorCoords.start[0] + 1,
                column: editorCoords.start[1]
            },
            end: {
                line: editorCoords.end[0] + 1,
                column: editorCoords.end[1]
            }
        };
    }

    function coordsFromAstToEditor(astCoords) {
        return {
            start: [astCoords.start.line - 1, astCoords.start.column],
            end: [astCoords.end.line - 1, astCoords.end.column]
        };
    }

    function getOuterAstCoords(expressionArray) {
        return {
            start: arrayUtils.first(expressionArray).loc.start,
            end: arrayUtils.last(expressionArray).loc.end
        }
    }

    return {
        coordsFromDocumentToEditor: typeHelper.enforce(
            'documentCoords => editorCoords',
            coordsFromDocumentToEditor),

        coordsFromEditorToDocument: typeHelper.enforce(
            'editorCoords => documentCoords',
            coordsFromEditorToDocument),

        coordsFromEditorToAst: typeHelper.enforce(
            'editorCoords => astCoords',
            coordsFromEditorToAst),

        coordsFromAstToEditor: typeHelper.enforce(
            'astCoords => editorCoords',
            coordsFromAstToEditor),
        
        getOuterAstCoords: typeHelper.enforce(
            'array<astNode> => astCoords',
            getOuterAstCoords)
    };
}

module.exports = coordsHelper;