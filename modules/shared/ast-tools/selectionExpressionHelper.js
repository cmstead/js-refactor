'use strict';

function selectionExpressionHelper(
    astHelper,
    typeHelper
) {

    const wrappingNodeTypes = [
        'VariableDeclaration',
        'ReturnStatement',
        'CallExpression',
        'Property'
    ];

    const isWrappingNode = astHelper.isNodeType(wrappingNodeTypes);

    function isExpressionNode(node) {
        const isExpression = typeof node.type === 'string'
            && (isWrappingNode(node) || (/expression/i).test(node.type));

        return isExpression;
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

    const isNearNode =
        (astCoords) =>
            (node) =>
                isExpressionNode(node)
                && astHelper.coordsInNode(astCoords, node);

    function getSelectionExpression(astCoords, ast) {
        let currentScope = null;
        const isSelectedNode = isMatchingNode(astCoords);

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                (node) => currentScope === null && isSelectedNode(node),
                (node) => currentScope = node
            )
        });

        return currentScope;
    }

    function getNearestExpression(astCoords, ast) {
        let currentScope = null;
        let lastScope = ast;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isNearNode(astCoords),
                function (node) {
                    if(!isWrappingNode(lastScope)) {
                        currentScope = node;
                    }

                    lastScope = node;
                }
            )
        });

        return currentScope;
    }

    return {
        getSelectionExpression: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getSelectionExpression),

        getNearestExpression: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestExpression),
    };
}

module.exports = selectionExpressionHelper