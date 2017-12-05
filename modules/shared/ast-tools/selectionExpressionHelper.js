'use strict';

function selectionExpressionHelper(
    astHelper,
    typeHelper
) {

    function isExpressionNode(node) {
        return typeof node.type === 'string'
            && (/expression/i).test(node.type);
    }

    function lineAndColumnMatch(selectionPosition, nodePosition) {
        return selectionPosition.line === nodePosition.line
            && selectionPosition.column === nodePosition.column;
    }

    function nodeCoordsMatch(astCoords, node) {
        return lineAndColumnMatch(astCoords.start, node.loc.start)
            && lineAndColumnMatch(astCoords.end, node.loc.end);
    }

    const isMatchingNode =
        (astCoords) =>
            (node) =>
                isExpressionNode(node)
                && nodeCoordsMatch(astCoords, node);

    function getSelectionExpression(astCoords, ast) {
        let currentScope = null;
        const isSelectedNode = isMatchingNode(astCoords);

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                (node) => currentScope === null &&isSelectedNode(node),
                (node) => currentScope = node
            )
        });

        return currentScope;
    }

    return {
        getSelectionExpression: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getSelectionExpression)
    };
}

module.exports = selectionExpressionHelper