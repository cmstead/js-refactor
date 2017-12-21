'use strict';

function selectionExpressionHelper(
    astHelper,
    typeHelper
) {

    const wrappingNodeTypes = [
        'VariableDeclaration',
        'ReturnStatement',
        'CallExpression',
        'MemberExpression',
        'IfStatement',
        'Property',
        'FunctionDeclaration'
    ];

    const exclusionWrappingNodeTypes = [
        'ArrowFunctionExpression',
        'BinaryExpression'
    ];

    const variableOrFunctionTypes = [
        'FunctionDeclaration',
        'VariableDeclaration'
    ];

    const functionDeclarationOrExpression = [
        'FunctionDeclaration',
        'FunctionExpression'
    ]

    const usageNode = [
        'CallExpression',
        'VariableDeclaration',
        'Property'
    ];

    const returnableExpression = [
        'CallExpression',
        'VariableDeclaration',
        'FunctionDeclaration',
        'FunctionExpression',
        'BinaryExpression',
        'AssignmentExpression',
        'ReturnStatement',
        'ObjectExpression'
    ];

    const isExclusionWrappingNode = astHelper.isNodeType(exclusionWrappingNodeTypes);
    const isFunctionDeclarationOrExpression = astHelper.isNodeType(functionDeclarationOrExpression);
    const isReturnableExpression = astHelper.isNodeType(returnableExpression);
    const isUsageNode = astHelper.isNodeType(usageNode);
    const isVariableOrFunction = astHelper.isNodeType(variableOrFunctionTypes);
    const isWrappingNode = astHelper.isNodeType(wrappingNodeTypes);

    const isBinaryExpression = astHelper.isNodeType(['BinaryExpression']);
    const isIdentifier = astHelper.isNodeType(['Identifier']);
    const isIfStatement = astHelper.isNodeType(['IfStatement']);
    const isVariabeDeclaration = astHelper.isNodeType(['VariableDeclaration']);


    function isExpressionNode(node) {
        const isExpression = typeof node.type === 'string'
            && !isExclusionWrappingNode(node)
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

    const isLocalityMatchingNode =
        (coordinateMatcher) =>
            (isMatchingNodeType) =>
                (astCoords) =>
                    (node) =>
                        isMatchingNodeType(node)
                        && coordinateMatcher(astCoords, node);

    const isMatchingNode = isLocalityMatchingNode(nodeCoordsMatch)(isExpressionNode);
    const isNearMatch = isLocalityMatchingNode(astHelper.coordsInNode);
    const isMatchInScope = isLocalityMatchingNode(astHelper.nodeInCoords);

    const isNearNode = isNearMatch(isExpressionNode);
    const isNearUsageNode = isNearMatch(isUsageNode);
    const isNearIdentifierExpression = isNearMatch(isIdentifier);
    const isNearVariableOrFunction = isNearMatch(isVariableOrFunction);
    const isNearConditional = isNearMatch(isIfStatement);
    const isNearFunctionExpression = isNearMatch(isFunctionDeclarationOrExpression);
    const isNearBinaryExpression = isNearMatch(isBinaryExpression);

    const isIdentifierInScope = isMatchInScope(isIdentifier);
    const isVariableDeclarationInScope = isMatchInScope(isVariabeDeclaration);

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

    function getNearestExpressionInScope(scopeAstCoords, selectionAstCoords, ast) {
        let currentScope = null;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isNearNode(selectionAstCoords),
                function (node) {
                    const isInScope = astHelper.nodeInCoords(scopeAstCoords, node);
                    const isNotSelectedScope = !astHelper.nodeMatchesCoords(scopeAstCoords, node);
                    const scopeNotSet = currentScope === null;

                    if (isInScope && isNotSelectedScope && scopeNotSet) {
                        currentScope = node;
                    }
                }
            )
        });

        return currentScope;
    }

    function getNearestIdentifierExpression(astCoords, ast) {
        let currentScope = null;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isNearIdentifierExpression(astCoords),
                function (node) {
                    currentScope = currentScope === null ? node : currentScope;
                }
            )
        });

        return currentScope;
    }

    function getNearestFunctionOrVariable(astCoords, ast) {
        let currentScope = null;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isNearVariableOrFunction(astCoords),
                function (node) {
                    currentScope = node;
                }
            )
        });

        return currentScope;
    }

    function getNearestFunctionExpression(astCoords, ast) {
        let currentScope = null;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isNearFunctionExpression(astCoords),
                function (node) {
                    currentScope = node;
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

    function getVariableDeclarationsInScope(astCoords, ast) {
        let variableDeclarations = [];

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isVariableDeclarationInScope(astCoords),
                function (node) {
                    variableDeclarations.push(node);
                }
            )
        });

        return variableDeclarations;
    }

    function getNearestIfCondition(astCoords, ast) {
        let currentScope = null;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isNearConditional(astCoords),
                node => currentScope = node
            )
        });

        return currentScope;
    }

    function getNearestStringNode(astCoords, ast) {
        let foundNode = null;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                (node) => isNearBinaryExpression(astCoords)(node) && foundNode === null,
                (node) => {
                    foundNode = node
                }
            )
        });

        return foundNode;
    }

    function getNearestUsageNode(astCoords, ast) {
        let foundNode = null;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isNearUsageNode(astCoords),
                (node) => foundNode = node
            )
        });

        return foundNode;
    }

    function last(values) {
        return values[values.length - 1];
    }

    function isExcludableExpression(node) {
        return node.type === 'CallExpression'
            && node.callee.type === 'MemberExpression'
            && !typeHelper.isTypeOf('isNonNativeIdentifier')(node.callee.object);
    }

    function getLastExpression(ast) {
        let foundNode = null;
        let nodeStack = [];

        astHelper.traverse(ast, {
            enter: function (node) {
                const parentNode = last(nodeStack);
                const captureExpression = isReturnableExpression(node)
                    && !isReturnableExpression(parentNode)
                    && !isExcludableExpression(node);

                nodeStack.push(node);


                if (captureExpression) {
                    foundNode = node;
                }
            },
            leave: function () {
                nodeStack.pop();
            }
        });

        return foundNode;
    }

    return {
        getIdentifiersInScope: typeHelper.enforce(
            'astCoords, ast => array<astNode>',
            getIdentifiersInScope),

        getSelectionExpression: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getSelectionExpression),

        getNearestIfCondition: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestIfCondition),

        getNearestFunctionExpression: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestFunctionExpression),

        getNearestFunctionOrVariable: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestFunctionOrVariable),

        getNearestIdentifierExpression: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestIdentifierExpression),

        getNearestStringNode: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestStringNode),

        getNearestUsageNode: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestUsageNode),

        getVariableDeclarationsInScope: typeHelper.enforce(
            'astCoords, ast => array<astNode>',
            getVariableDeclarationsInScope),

        getNearestExpressionInScope: typeHelper.enforce(
            'astCoords, astCoords, ast => variant<null, astNode>',
            getNearestExpressionInScope),

        getLastExpression: typeHelper.enforce(
            'ast => variant<null, astNode>',
            getLastExpression)
    };
}

module.exports = selectionExpressionHelper;