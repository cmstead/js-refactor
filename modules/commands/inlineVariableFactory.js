'use strict';

function inlineVariableFactory(
    astHelper,
    coordsHelper,
    logger,
    editActionsFactory,
    parser,
    scopePathHelper,
    selectionHelper,
    selectionExpressionHelper,
    utilities,
    vsCodeFactory
) {

    return function (_, callback) {

        function getSelectionEditorCoords(activeEditor) {
            const firstSelectionCoords = utilities.getAllSelectionCoords(activeEditor)[0];
            return coordsHelper.coordsFromDocumentToEditor(firstSelectionCoords);
        }

        const isMatchingIdentifier =
            (identifierName) =>
                (node) =>
                    node.name === identifierName;

        const isNotMatchingLoc =
            (identifierLoc) =>
                (node) =>
                    !astHelper.nodeMatchesCoords(identifierLoc, node);

        function buildUpdateData(replacementExpression) {
            return function (node) {
                return {
                    coords: coordsHelper.coordsFromAstToEditor(node.loc),
                    replacementValue: replacementExpression
                }
            }
        }

        function isAscendingOrder(update1, update2) {
            return update1.end[0] < update2.end[0]
                || (update1.end[0] === update2.end[0]
                    && update1.end[1] < update2.end[1]);
        }

        function compareCoords(update1, update2) {
            if (isAscendingOrder(update1.coords, update2.coords)) {
                return -1;
            } else if (isAscendingOrder(update2.coords, update1.coords)) {
                return 1
            } else {
                return 0;
            }
        }

        function applyEdits(activeEditor, updateEdits) {
            const editActions = editActionsFactory(activeEditor);
            const currentEdit = updateEdits.pop();

            editActions.applySetEdit(currentEdit.replacementValue, currentEdit.coords).then(function () {
                if (updateEdits.length > 0) {
                    applyEdits(activeEditor, updateEdits);
                } else {
                    callback();
                }
            });
        }

        function inlineVariable(activeEditor, variableExpression, sourceLines, ast) {
            const scopePath = scopePathHelper.buildScopePath(variableExpression.loc, ast);
            const varScope = scopePath[scopePath.length - 1];

            const identifierName = variableExpression.declarations[0].id.name;
            const identifierLoc = variableExpression.declarations[0].id.loc;

            const expressionLoc = variableExpression.declarations[0].init.loc;
            const expressionCoords = coordsHelper.coordsFromAstToEditor(expressionLoc);

            const expressionString = selectionHelper
                .getSelection(sourceLines, expressionCoords)
                .join('\n');

            const documentUpdates = selectionExpressionHelper
                .getIdentifiersInScope(varScope.loc, ast)
                .filter((node) =>
                    isMatchingIdentifier(identifierName)(node)
                    && isNotMatchingLoc(identifierLoc)(node))
                .map(buildUpdateData(expressionString));

            documentUpdates.sort(compareCoords);
            documentUpdates.unshift(buildUpdateData('')(variableExpression));

            applyEdits(activeEditor, documentUpdates);
        }

        function getVariableDeclarations(identifierNode, ast) {
            const identifierName = identifierNode.name;
            const scopePath = scopePathHelper.buildScopePath(identifierNode.loc, ast);
            const localScope = scopePath[scopePath.length - 1];

            const variableExpressions = selectionExpressionHelper
                .getVariableDeclarationsInScope(localScope.loc, ast)
                .filter(node => node.declarations[0].id.name === identifierName);
            
            return variableExpressions.length > 0 ? variableExpressions[0] : null;
        }

        function getVariableExpression(selectionAstCoords, ast) {
            let identityExpression = selectionExpressionHelper.getNearestIdentifierExpression(selectionAstCoords, ast);

            return identityExpression !== null ? getVariableDeclarations(identityExpression, ast) : null;
        }

        return function () {
            const activeEditor = vsCodeFactory.get().window.activeTextEditor;
            const selectionEditorCoords = getSelectionEditorCoords(activeEditor);
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const sourceLines = utilities.getDocumentLines(activeEditor);
            const ast = parser.parseSourceLines(sourceLines);

            const variableExpression = getVariableExpression(selectionAstCoords, ast);

            if (variableExpression === null) {
                logger.info('Cannot inline a non-variable value.');
            } else if (variableExpression.declarations[0].init === null) {
                logger.info('Cannot inline an unassigned variable.');
            } else {
                inlineVariable(activeEditor, variableExpression, sourceLines, ast);
            }
        }

    }
}

module.exports = inlineVariableFactory;