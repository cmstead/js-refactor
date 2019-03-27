'use strict';

function selectionVariableHelper(
    astHelper,
    typeHelper
) {

    const isMemberExpression = astHelper.isNodeType(['MemberExpression']);
    const isProperty = astHelper.isNodeType(['Property']);
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

    function isPropertyValue(node, parentNode) {
        return isProperty(parentNode)
            && parentNode.value.type === 'Identifier'
            && parentNode.value.name === node.name;
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
            'ArrayExpression',
            'BinaryExpression',
            'CallExpression',
            'IfStatement',
            'Literal',
            'ReturnStatement'
        ];

        const parentNodeType = parentNode.type;

        return isMemberObject(node, parentNode)
            || isMemberCall(node, parentNode)
            || isPropertyValue(node, parentNode)
            || acceptableParentNodes.includes(parentNodeType);
    }

    function isVariableUsage(node, parentNode) {
        return isIdentifier(node) && isIdentifierUsage(node, parentNode);
    }

    function last(values) {
        return values[values.length - 1];
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
                if (isIdentifier(node) && !isNonNativeIdentifier(node)) {
                    return;
                }

                if (node.type !== 'Identifier') {
                    parentNode = node;
                }

                if (isFunctionNode(node)) {
                    functionStack.push(node);
                }

                if (containsDestinationScope(node)) {
                    lastScopePathNode = node;
                }

                const lastFunctionScope = last(functionStack);

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
                if (last(functionStack) === node) {
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
                if (isIdentifier(node) && !isNonNativeIdentifier(node)) {
                    return;
                }

                if (node.type !== 'Identifier') {
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

    return {
        getUnboundVars: typeHelper.enforce(
            'selectionAstCoords: astCoords, destinationAstCoords: astCoords, ast => unboundVars',
            getUnboundVars),
        getIdentifiersInScope: typeHelper.enforce(
            'astCoords, ast => array<astNode>',
            getIdentifiersInScope)
    };

}

module.exports = selectionVariableHelper;