'use strict';

const estraverse = require('estraverse');

function astHelper() {

    function noOp() { }

    function onMatch(matchCheck, action) {
        return function (node) {
            if (matchCheck(node)) {
                action(node);
            }
        }
    }

    function isNodeType(nodeTypes) {
        return function (node) {
            return nodeTypes.indexOf(node.type) > -1;
        };
    }

    function functionOrDefault(userFunction) {
        return typeof userFunction === 'function' ? userFunction : noOp;
    }

    function traverse(ast, options) {
        const enterFn = functionOrDefault(options.enter);

        const traversal = {
            enter: function (node) {
                enterFn(node);
            },
            leave: functionOrDefault(options.leave)
        }

        estraverse.traverse(ast, traversal);
    }

    return {
        isNodeType: isNodeType,
        onMatch: onMatch,
        traverse: traverse
    };

}

module.exports = astHelper;