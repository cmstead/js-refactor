'use strict';

function selectionVariableHelper(
    astHelper,
    typeHelper
) {

    const isFunctionScope = astHelper.isNodeType(['FunctionDeclaration', 'FunctionExpression']);
    const isVar = astHelper.isNodeType(['VariableDeclarator']);
    const isIdentifier = astHelper.isNodeType(['Identifier']);
    const isLiteral = astHelper.isNodeType(['Literal']);
    const isMemberExpression = astHelper.isNodeType(['MemberExpression']);
    const isFunctionDeclaration = astHelper.isNodeType(['FunctionDeclaration']);
    const isProperty = astHelper.isNodeType(['Property']);

    const isContainingFunctionScope =
        (destinationAstCoords, node) =>
            isFunctionScope(node)
            && astHelper.coordsInNode(destinationAstCoords, node);

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
            if(functionNode.id !== null) {
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

    function processFunction (boundVars) {
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
        let currentScope = null;
        let nodeStack = [];

        let boundVars = {};
        let identifiers = {};

        const processFunctionData = processFunction(boundVars);
        const processFunctionNameValue = processFunctionName(boundVars);
        const processIdentifier = processIdentifiers(identifiers);
        const processVariable = processBoundVars(boundVars);

        astHelper.traverse(ast, {
            enter: function (node) {
                const parentNode = last(nodeStack);

                const isNativeIdentifier = isIdentifier(node) && !isNonNativeIdentifier(node);
                const isPropertyIdentifier = isIdentifier(node)
                    && isMemberExpression(parentNode)
                    && parentNode.property === node;

                nodeStack.push(node);

                if (isNativeIdentifier || isPropertyIdentifier) {
                    boundVars[node.name] = true;
                } else if(isProperty(node)) {
                    const varKey = node.key.name;
                    boundVars[varKey] = true
                } else if (isContainingFunctionScope(destinationAstCoords, node)) {
                    currentScope = node;
                    processFunctionData(node);
                } else if (isFunctionDeclaration(node)) {
                    processFunctionNameValue(node);
                } else if (currentScope !== null && !isFunctionScope(node)) {
                    processVariable(node);
                } else {
                    currentScope = null;
                }

                if (isNodeInSelection(selectionAstCoords, node)) {
                    processVariable(node);
                    processIdentifier(node);
                }

            },
            leave: function () {
                nodeStack.pop();
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