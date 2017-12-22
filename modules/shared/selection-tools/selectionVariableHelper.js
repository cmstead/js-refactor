'use strict';

function selectionVariableHelper(
    astHelper,
    typeHelper
) {

    const isFunctionScope = astHelper.isNodeType(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression']);
    const isVar = astHelper.isNodeType(['VariableDeclarator']);
    const isIdentifier = astHelper.isNodeType(['Identifier']);
    const isMemberExpression = astHelper.isNodeType(['MemberExpression']);
    const isFunctionDeclaration = astHelper.isNodeType(['FunctionDeclaration']);
    const isProperty = astHelper.isNodeType(['Property']);

    const isContainingNode =
        (destinationAstCoords) =>
            (node) =>
                astHelper.coordsInNode(destinationAstCoords, node);

    const isNodeInSelection =
        (astCoords, node) =>
            astHelper.nodeInCoords(astCoords, node);

    const isNonNativeIdentifier = typeHelper.isTypeOf('nonNativeIdentifier');

    function processIdentifiers(identifiers) {
        return function (node) {
            const nodeIsNonNativeIdentifier = isNonNativeIdentifier(node);

            if (nodeIsNonNativeIdentifier && isIdentifier(node) && typeof node.name === 'string') {
                identifiers[node.name] = true;
            } else if (nodeIsNonNativeIdentifier && typeof node.object.name === 'string') {
                identifiers[node.object.name] = true;
            }
        };
    }

    function processBoundVars(boundVars) {
        return function (node) {
            if (isVar(node)) {
                const key = node.id.name;
                boundVars[key] = true;
            }
        };
    }

    function processFunctionName(boundVars) {
        return function (functionNode) {
            if (functionNode.id !== null) {
                boundVars[functionNode.id.name] = true;
            }
        }
    }

    function processFunctionParams(boundVars) {
        return function (params) {
            return params
                .filter(param => param.type === 'Identifier')
                .reduce(function (boundVarsObj, param) {
                    boundVarsObj[param.name] = true;
                    return boundVarsObj;
                }, boundVars);
        }
    }

    function processFunction(boundVars) {
        const processName = processFunctionName(boundVars);
        const processParams = processFunctionParams(boundVars);

        return function (functionNode) {
            processName(functionNode);
            processParams(functionNode.params);

            return boundVars;
        }
    }

    function last(values) {
        return values[values.length - 1];
    }

    function getUnboundVars(selectionAstCoords, destinationAstCoords, ast) {
        let scopeStack = [];
        let nodeStack = [];

        let boundVars = {};
        let identifiers = {};

        const processFunctionData = processFunction(boundVars);
        const processFunctionNameValue = processFunctionName(boundVars);
        const processIdentifier = processIdentifiers(identifiers);
        const processVariable = processBoundVars(boundVars);
        const isContainingScope = isContainingNode(destinationAstCoords);

        function addToBoundVars(key) {
            boundVars[key] = true;
        }

        astHelper.traverse(ast, {
            enter: function (node) {
                const parentNode = last(nodeStack);
                const parentScope = last(scopeStack);

                const isNativeIdentifier = isIdentifier(node) && !isNonNativeIdentifier(node);
                const isPropertyIdentifier = isIdentifier(node)
                    && isMemberExpression(parentNode)
                    && parentNode.property === node;

                nodeStack.push(node);

                if (isFunctionScope(node)) {
                    scopeStack.push(node);
                }

                const notInContainingScope = parentScope && !isContainingScope(parentScope);

                if (isNativeIdentifier || isPropertyIdentifier) {
                    if(!parentScope || isContainingScope(parentScope)) {
                        addToBoundVars(node.name);
                    }
                } else if (isNodeInSelection(selectionAstCoords, node)) {
                    processVariable(node);
                    processIdentifier(node);
                } else if (notInContainingScope) {
                    return;
                }

                if (isProperty(node)) {
                    addToBoundVars(node.key.name);
                } else if (isContainingScope(node) && isFunctionDeclaration(node)) {
                    processFunctionData(node);
                } else if (isFunctionDeclaration(node)) {
                    processFunctionNameValue(node);
                } else if (!isNodeInSelection(selectionAstCoords, node)) {
                    processVariable(node);
                }

            },
            leave: function (node) {
                nodeStack.pop();
                if (last(scopeStack) === node) {
                    scopeStack.pop();
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