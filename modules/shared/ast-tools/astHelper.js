'use strict';

const estraverse = require('estraverse');

function astHelper(typeHelper) {

    function noOp() { }

    function onMatch(nodeMatchCheck, nodeAction) {
        return function (astNode) {
            if (nodeMatchCheck(astNode)) {
                nodeAction(astNode);
            }
        }
    }

    function isNodeType(nodeTypes) {
        return function (astNode) {
            return nodeTypes.indexOf(astNode.type) > -1;
        };
    }

    function functionOrDefault(userFunction) {
        return typeof userFunction === 'function' ? userFunction : noOp;
    }

    function traverse(ast, traversalOptions) {
        const enterFn = functionOrDefault(traversalOptions.enter);

        const traversal = {
            enter: function (node) {
                enterFn(node);
            },
            leave: functionOrDefault(traversalOptions.leave)
        }

        estraverse.traverse(ast, traversal);
    }

    return {
        isNodeType: typeHelper.enforce(
            'nodeTypes => astNode => boolean', 
            isNodeType),

        onMatch: typeHelper.enforce(
            'nodeMatchCheck:(astNode => boolean), nodeAction:(astNode => undefined) => undefined', 
            onMatch),
            
        traverse: typeHelper.enforce(
            'ast, traversalOptions => undefined', 
            traverse)
    };

}

module.exports = astHelper;