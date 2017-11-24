'use strict';

function coordsHelper(typeHelper) {
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

    function coordsInNode(selectionCoords, astNode) {
        const nodeStart = astNode.loc.start;
        const nodeEnd = astNode.loc.end;

        const afterStartLine = selectionCoords.start.line > nodeStart.line;
        const afterStartCharacter = selectionCoords.start.line === nodeStart.line 
            && selectionCoords.start.column >= nodeStart.column;

        const beforeEndLine = selectionCoords.end.line < nodeEnd.line;
        const beforeEndCharacter = selectionCoords.end.line === nodeEnd.line 
            && selectionCoords.end.column <= nodeEnd.column;

        return (afterStartLine || afterStartCharacter) && (beforeEndLine || beforeEndCharacter);
    }

    return {
        coordsFromEditorToAst: typeHelper.enforce(
            'editorCoords => astCoords',
            coordsFromEditorToAst),

        coordsFromAstToEditor: typeHelper.enforce(
            'astCoords => editorCoords',
            coordsFromAstToEditor),

        coordsInNode: typeHelper.enforce(
            'selectionCoords, astNode => boolean', 
            coordsInNode)
    };
}

module.exports = coordsHelper;