'use strict';

function selectionVariableHelper(
    astHelper,
    typeHelper
) {

    const isMemberExpression = astHelper.isNodeType(['MemberExpression']);
    const isIdentifier = astHelper.isNodeType(['Identifier']);
    const isNonNativeIdentifier = typeHelper.isTypeOf('nonNativeIdentifier');


    const isContainingNode =
        (destinationAstCoords) =>
            (node) =>
                astHelper.coordsInNode(destinationAstCoords, node);

    const isNodeInSelection =
        (astCoords) =>
            (node) =>
                astHelper.nodeInCoords(astCoords, node);


    function isFunctionNode(node) {
        const acceptableFunctionNodes = [
            'FunctionExpression',
            'FunctionDeclaration',
            'ArrowFunctionExpression',
            'MethodDefinition'
        ];

        return acceptableFunctionNodes.includes(node.type);
    }

    function isMemberObject(node, parentNode) {
        return isMemberExpression(parentNode)
            && parentNode.object.name === node.name;
    }

    function isMemberCall(node, parentNode) {
        return isMemberExpression(parentNode)
            && parentNode.object.name !== node.name
            && parentNode.property.name !== node.name;
    }

    function isIdentifierBinding(node, parentNode) {
        const acceptableParentNodes = [
            'VariableDeclarator'
        ];

        const parentNodeType = parentNode.type;

        return isFunctionNode(node) || acceptableParentNodes.includes(parentNodeType);
    }

    function isVariableBinding(node, parentNode) {
        return isIdentifier(node) && isIdentifierBinding(node, parentNode);
    }

    function isIdentifierUsage(node, parentNode) {
        const acceptableParentNodes = [
            'BinaryExpression',
            'CallExpression',
            'IfStatement',
            'Literal',
            'ReturnStatement'
        ];

        const parentNodeType = parentNode.type;

        return isMemberObject(node, parentNode)
            || isMemberCall(node, parentNode)
            || acceptableParentNodes.includes(parentNodeType);
    }

    function isVariableUsage(node, parentNode) {
        return isIdentifier(node) && isIdentifierUsage(node, parentNode);
    }

    function getUnboundVars(selectionAstCoords, destinationAstCoords, ast) {
        let parentNode = ast;
        let lastScopePathNode = ast;
        let lastFunctionScope = null;

        let boundVars = {};
        let identifiers = {};

        const containsDestinationScope = isContainingNode(destinationAstCoords);
        const isContainedInDestinationScope = isNodeInSelection(destinationAstCoords);
        const isContainedInSelection = isNodeInSelection(selectionAstCoords)

        function addToBoundVars(key) {
            boundVars[key] = true;
        }

        function addToIdentifiers(key) {
            identifiers[key] = true;
        }

        astHelper.traverse(ast, {
            enter: function (node) {
                if (isIdentifier(node) && !isNonNativeIdentifier(node)) {
                    return;
                }

                if (node.type !== 'Identifier') {
                    parentNode = node;
                }

                if (isFunctionNode(node)) {
                    lastFunctionScope = node;
                }

                if (containsDestinationScope(node)) {
                    lastScopePathNode = node;
                }

                const isInBindingScope = isNodeInSelection(lastScopePathNode.loc)(node)
                    || (isContainedInDestinationScope(node) && !isContainedInSelection(node));

                if (isContainedInSelection(node)) {
                    if (isVariableBinding(node, parentNode)) {
                        addToBoundVars(node.name);
                    } else if (isVariableUsage(node, parentNode)) {
                        addToIdentifiers(node.name);
                    }
                } else if (lastFunctionScope === node && isInBindingScope) {
                    if (typeof node.id === 'object' && node.id !== null) {
                        addToBoundVars(node.id.name);
                    }
                } else if (isInBindingScope) {
                    if (isVariableBinding(node, parentNode)) {
                        addToBoundVars(node.name);
                    }
                }
            }
        });

        return Object.keys(identifiers).filter(identifier => !boundVars[identifier]);
    }

    return {
        getUnboundVars: typeHelper.enforce(
            'selectionAstCoords: astCoords, destinationAstCoords: astCoords, ast => unboundVars',
            getUnboundVars)
    };

}

module.exports = selectionVariableHelper;