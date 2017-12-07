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

    const variableExpression = [
        'VariableDeclaration',
        'Identifier'
    ];

    const isWrappingNode = astHelper.isNodeType(wrappingNodeTypes);
    const isVariableExpression = astHelper.isNodeType(variableExpression);
    const isIdentifier = astHelper.isNodeType(['Identifier']);

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

    const isNearVariableExpression =
        (astCoords) =>
            (node) => 
                isVariableExpression(node)
                && astHelper.coordsInNode(astCoords, node);
    
    const isIdentifierInScope =
        (astCoords) =>
            (node) =>
                isIdentifier(node)
                && astHelper.nodeInCoords(astCoords, node);

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
                    if (!isWrappingNode(lastScope)) {
                        currentScope = node;
                    }

                    lastScope = node;
                }
            )
        });

        return currentScope;
    }

    function getNearestVariableExpression(astCoords, ast) {
        let currentScope = null;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isNearVariableExpression(astCoords),
                function (node) {
                    currentScope = currentScope === null ? node : currentScope;
                }
            )
        });

        return currentScope;
    }

    function getIdentifiersInScope(astCoords, ast) {
        let identifiers = [];

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isIdentifierInScope(astCoords),
                function (node) {
                    identifiers.push(node);
                }
            )
        });

        return identifiers;
    }

    return {
        getIdentifiersInScope: typeHelper.enforce(
            'astCoords, ast => array<astNode>',
            getIdentifiersInScope),

        getSelectionExpression: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getSelectionExpression),

        getNearestExpression: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestExpression),

        getNearestVariableExpression: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestVariableExpression)
    };
}

module.exports = selectionExpressionHelper;