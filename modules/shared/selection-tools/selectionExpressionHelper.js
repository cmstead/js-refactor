'use strict';

function selectionExpressionHelper(
    astHelper,
    nodeTypes,
    nodeTypeValidator,
    typeHelper
) {

    const wrappingNodeTypes = [
        nodeTypes.VariableDeclaration,
        nodeTypes.ReturnStatement,
        nodeTypes.CallExpression,
        nodeTypes.MemberExpression,
        nodeTypes.MethodDefinition,
        nodeTypes.IfStatement,
        nodeTypes.Property,
        nodeTypes.FunctionDeclaration
    ];

    const exclusionWrappingNodeTypes = [
        nodeTypes.ArrowFunctionExpression,
        nodeTypes.BinaryExpression
    ];

    const variableOrFunctionTypes = [
        nodeTypes.FunctionDeclaration,
        nodeTypes.VariableDeclaration
    ];

    const usageNode = [
        nodeTypes.CallExpression,
        nodeTypes.VariableDeclaration,
        nodeTypes.Property
    ];


    function isFunctionDeclarationOrExpression(node) {
        return nodeTypeValidator.isFunctionDeclaration(node)
            || nodeTypeValidator.isFunctionExpression(node);
    }

    const isExclusionWrappingNode = astHelper.isNodeType(exclusionWrappingNodeTypes);
    const isUsageNode = astHelper.isNodeType(usageNode);
    const isVariableOrFunction = astHelper.isNodeType(variableOrFunctionTypes);
    const isWrappingNode = astHelper.isNodeType(wrappingNodeTypes);


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

    const isNearArrowFunction = isNearMatch(nodeTypeValidator.isArrowFunctionExpression);
    const isNearBinaryExpression = isNearMatch(nodeTypeValidator.isBinaryExpression);
    const isNearConditional = isNearMatch(nodeTypeValidator.isIfStatement);
    const isNearFunctionExpression = isNearMatch(isFunctionDeclarationOrExpression);
    const isNearIdentifierExpression = isNearMatch(nodeTypeValidator.isIdentifier);
    const isNearMethodDefinition = isNearMatch(nodeTypeValidator.isMethodDefinition);
    const isNearNode = isNearMatch(isExpressionNode);
    const isNearUsageNode = isNearMatch(isUsageNode);
    const isNearVariableDeclaration = isNearMatch(nodeTypeValidator.isVariableDeclaration);
    const isNearVariableOrFunction = isNearMatch(isVariableOrFunction);


    const isVariableDeclarationInScope = isMatchInScope(nodeTypeValidator.isVariableDeclaration);

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

    function getNearestMethodDeclaration(astCoords, ast) {
        let currentScope = null;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isNearMethodDefinition(astCoords),
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

    function getNearestArrowFunction(astCoords, ast) {
        let currentScope = null;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isNearArrowFunction(astCoords),
                function (node) {
                    currentScope = node;
                }
            )
        });

        return currentScope;
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

    function getLastIndependentExpression(ast) {
        let foundNode = null;
        let nodeStack = [];

        astHelper.traverse(ast, {
            enter: function (node) {
                if (nodeStack.length === 1 && !nodeTypeValidator.isReturnStatement(node)) {
                    foundNode = node;
                }

                nodeStack.push(node);
            },
            leave: function () {
                nodeStack.pop();
            }
        });

        return foundNode;
    }

    function getNearestFunctionAssignment(astCoords, ast) {
        let foundNode = null;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isNearVariableDeclaration(astCoords),
                function (node) {
                    if(Boolean(node.declarations[0].init) && node.declarations[0].init.type === nodeTypes.FunctionExpression) {
                        foundNode = node;
                    }
                }
            )
        });

        return foundNode;
    }

    return {
        getSelectionExpression: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getSelectionExpression),

        getNearestArrowFunction: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestArrowFunction),

        getNearestIfCondition: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestIfCondition),

        getNearestFunctionAssignment: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestFunctionAssignment),

        getNearestFunctionExpression: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestFunctionExpression),

        getNearestFunctionOrVariable: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestFunctionOrVariable),

        getNearestIdentifierExpression: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestIdentifierExpression),

        getNearestMethodDeclaration: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestMethodDeclaration),

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

        getLastIndependentExpression: typeHelper.enforce(
            'astNode => variant<null, astNode>',
            getLastIndependentExpression)
    };
}

module.exports = selectionExpressionHelper;