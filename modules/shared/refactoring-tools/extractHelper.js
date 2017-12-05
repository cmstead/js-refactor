'use strict';

function extractHelper(
    typeHelper,
    coordsHelper,
    scopePathHelper
) {

    function getScopePath(editorCoords, ast) {
        const astCoords = coordsHelper.coordsFromEditorToAst(editorCoords);

        return scopePathHelper.buildScopePath(astCoords, ast);
    }

    const isScopeType =
        (nodeType) =>
            (astNode) =>
                astNode.type.toLowerCase().indexOf(nodeType) > -1;
            
    const isObjectScope = isScopeType('object');
    const isProgramScope = isScopeType('program');

    function getNewMethodLocation(scopePath, selectedOptionIndex) {
        const selectedScope = scopePath[selectedOptionIndex];
        const nextScope = scopePath[selectedOptionIndex + 1];

        const isFunctionScope = !isProgramScope(selectedScope) && !isObjectScope(selectedScope);
        const isLocalScope = scopePath.length - 1 === selectedOptionIndex;

        let destinationEditorCoords;
        let bodyOffset = 1;

        if (!isLocalScope) {
            destinationEditorCoords = coordsHelper.coordsFromAstToEditor(nextScope.loc);
            bodyOffset = 0;
        } else if (isObjectScope(selectedScope)) {
            destinationEditorCoords = coordsHelper.coordsFromAstToEditor(selectedScope.loc);
        } else if (isLocalScope && isFunctionScope) {
            destinationEditorCoords = coordsHelper.coordsFromAstToEditor(selectedScope.body.loc);
        } else {
            destinationEditorCoords = coordsHelper.coordsFromAstToEditor(selectedScope.loc);
            bodyOffset = 0;
        }

        return {
            start: [destinationEditorCoords.start[0], destinationEditorCoords.start[1] + bodyOffset],
            end: [destinationEditorCoords.start[0], destinationEditorCoords.start[1] + bodyOffset]
        };
    }

    return {
        getNewMethodLocation: typeHelper.enforce(
            'scopePath, selectedOptionIndex => editorCoords',
            getNewMethodLocation),

        getScopePath: typeHelper.enforce(
            'editorCoords, ast => array<astNode>',
            getScopePath),

        isObjectScope: typeHelper.enforce(
            'astNode => boolean',
            isObjectScope),

        isProgramScope: typeHelper.enforce(
            'astNode => boolean',
            isProgramScope),

    }
}

module.exports = extractHelper;