'use strict';

function selectionVariableHelper(
    arrayUtils,
    astHelper,
    nodeTypes,
    nodeTypeValidator,
    typeHelper
) {

    const isNonNativeIdentifier = typeHelper.isTypeOf('nonNativeIdentifier');

    function isFunctionNode(node) {
        const acceptableFunctionNodes = [
            nodeTypes.FunctionExpression,
            nodeTypes.FunctionDeclaration,
            nodeTypes.ArrowFunctionExpression,
            nodeTypes.MethodDefinition
        ];

        return acceptableFunctionNodes.includes(node.type);
    }

    const isContainingNode =
        (destinationAstCoords) =>
            (node) =>
                astHelper.coordsInNode(destinationAstCoords, node);

    const isNodeInSelection =
        (astCoords) =>
            (node) =>
                astHelper.nodeInCoords(astCoords, node);


    function isMemberObject(node, parentNode) {
        return nodeTypeValidator.isMemberExpression(parentNode)
            && parentNode.object.name === node.name;
    }

    function isMemberCall(node, parentNode) {
        return nodeTypeValidator.isMemberExpression(parentNode)
            && parentNode.object.name !== node.name
            && parentNode.property.name !== node.name;
    }

    function isPropertyValue(node, parentNode) {
        return nodeTypeValidator.isProperty(parentNode)
            && nodeTypeValidator.isIdentifier(parentNode.value)
            && parentNode.value.name === node.name;
    }

    function isIdentifierBinding(node, parentNode) {
        const acceptableParentNodes = [
            nodeTypes.VariableDeclarator
        ];

        const parentNodeType = parentNode.type;

        return isFunctionNode(node) || acceptableParentNodes.includes(parentNodeType);
    }

    function isVariableBinding(node, parentNode) {
        return nodeTypeValidator.isIdentifier(node) && isIdentifierBinding(node, parentNode);
    }

    function isIdentifierUsage(node, parentNode) {
        const acceptableParentNodes = [
            nodeTypes.ArrayExpression,
            nodeTypes.BinaryExpression,
            nodeTypes.CallExpression,
            nodeTypes.IfStatement,
            nodeTypes.Literal,
            nodeTypes.ReturnStatement
        ];

        const parentNodeType = parentNode.type;

        return isMemberObject(node, parentNode)
            || isMemberCall(node, parentNode)
            || isPropertyValue(node, parentNode)
            || acceptableParentNodes.includes(parentNodeType);
    }

    function isVariableUsage(node, parentNode) {
        return nodeTypeValidator.isIdentifier(node) && isIdentifierUsage(node, parentNode);
    }

    function getUnboundVars(selectionAstCoords, destinationAstCoords, ast) {
        let parentNode = ast;
        let lastScopePathNode = ast;
        let functionStack = [];

        let boundVars = {};
        let identifiers = {};

        const containsDestinationScope = isContainingNode(destinationAstCoords);
        const isContainedInDestinationScope = isNodeInSelection(destinationAstCoords);
        const containsSelection = isContainingNode(selectionAstCoords);
        const isContainedInSelection = isNodeInSelection(selectionAstCoords)

        function addToBoundVars(key) {
            boundVars[key] = true;
        }

        function addToIdentifiers(key) {
            identifiers[key] = true;
        }

        astHelper.traverse(ast, {
            enter: function (node) {
                if (nodeTypeValidator.isIdentifier(node) && !isNonNativeIdentifier(node)) {
                    return;
                }

                if (!nodeTypeValidator.isIdentifier(node)) {
                    parentNode = node;
                }

                if (isFunctionNode(node)) {
                    functionStack.push(node);
                }

                if (containsDestinationScope(node)) {
                    lastScopePathNode = node;
                }

                const lastFunctionScope = arrayUtils.last(functionStack);

                const isContainedInScopePath =
                    !Boolean(lastFunctionScope)
                    || (
                        !isContainedInDestinationScope(lastFunctionScope)
                        && containsSelection(lastFunctionScope)
                    );


                const isInBindingScope = isNodeInSelection(lastScopePathNode.loc)(node)
                    || (isContainedInDestinationScope(node) && !isContainedInSelection(node));

                const nodeIsContainedInSelection = isContainedInSelection(node);

                if (
                    nodeIsContainedInSelection
                    && isVariableUsage(node, parentNode)
                ) {
                    addToIdentifiers(node.name);
                } else if (
                    lastFunctionScope === node
                    && isInBindingScope
                    && typeof node.id === 'object'
                    && node.id !== null
                ) {
                    addToBoundVars(node.id.name);
                } else if (
                    (nodeIsContainedInSelection
                        && isVariableBinding(node, parentNode))

                    ||

                    (isInBindingScope
                        && isContainedInScopePath
                        && isVariableBinding(node, parentNode))
                ) {
                    addToBoundVars(node.name);
                }
            },

            leave: function (node) {
                if (arrayUtils.last(functionStack) === node) {
                    functionStack.pop();
                }
            }
        });

        return Object.keys(identifiers).filter(identifier => !boundVars[identifier]);
    }

    function getIdentifiersInScope(astCoords, ast) {
        let parentNode = ast;
        let identifiers = [];

        const containedInSelectedScope = isNodeInSelection(astCoords);

        astHelper.traverse(ast, {
            enter: function (node) {
                if (nodeTypeValidator.isIdentifier(node) && !isNonNativeIdentifier(node)) {
                    return;
                }

                if (!nodeTypeValidator.isIdentifier(node)) {
                    parentNode = node;
                }

                if (
                    containedInSelectedScope(node)
                    && isVariableUsage(node, parentNode)
                ) {
                    identifiers.push(node);
                }
            }
        });

        return identifiers;
    }

    function getNearestIdentifier(astCoords, ast) {
        let parentNode = ast;
        let foundNode = null;

        const nodeContainsSelection = isContainingNode(astCoords);

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                (node) => nodeContainsSelection(node),
                function (node) {
                    if (!nodeTypeValidator.isIdentifier(node)) {
                        parentNode = node;
                    }

                    if (nodeTypeValidator.isIdentifier(node)
                        && (
                            isIdentifierBinding(node, parentNode)
                            || isIdentifierUsage(node, parentNode))) {
                        foundNode = node;
                    }
                }
            )
        });

        return foundNode;
    }

    return {
        getIdentifiersInScope: typeHelper.enforce(
            'astCoords, ast => array<astNode>',
            getIdentifiersInScope),
        getNearestIdentifier: typeHelper.enforce(
            'astCoords, ast => variant<null, astNode>',
            getNearestIdentifier),
        getUnboundVars: typeHelper.enforce(
            'selectionAstCoords: astCoords, destinationAstCoords: astCoords, ast => unboundVars',
            getUnboundVars)
    };

}

module.exports = selectionVariableHelper;