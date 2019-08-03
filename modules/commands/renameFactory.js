function renameFactory (
    coordsHelper,
    editActionsFactory,
    extractHelper,
    logger,
    parser,
    scopeHelper,
    selectionHelper,
    selectionVariableHelper,
    templateHelper,
    vsCodeHelperFactory
) {
    'use strict';

    return function (callback) {
        const vsCodeHelper = vsCodeHelperFactory();

        function findNearestScope(identifierNode, ast) {
            
        }

        return function () {
            const selectionEditorCoords = vsCodeHelper.getSelectionCoords();
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const sourceLines = vsCodeHelper.getSourceLines();
            const sourceAst = parser.parseSourceLines(sourceLines);

            const nearestIdentifier = selectionVariableHelper.getNearestIdentifier(selectionAstCoords, sourceAst);

            if(nearestIdentifier === null) {
                logger.info('Cannot rename selected identifier or value');
            } else {
                const nearestIdentifierScope = findNearestScope(nearestIdentifier, sourceAst);
            }
        };
    };
}

module.exports = renameFactory;