'use strict';

function astHelper(estraverse, typeHelper) {

    function noOp() { }

    function coordsContainedIn(containerCoords, testCoords) {
        const onOrAfterStart = testCoords.start.line > containerCoords.start.line
            || (testCoords.start.line === containerCoords.start.line
                && testCoords.start.column >= containerCoords.start.column);

        const onOrBeforeEnd = testCoords.end.line < containerCoords.end.line
            || (testCoords.end.line === containerCoords.end.line
                && testCoords.end.column <= containerCoords.end.column);

        return onOrAfterStart && onOrBeforeEnd;
    }

    const coordsInNode =
        (selectionCoords, astNode) =>
            coordsContainedIn(astNode.loc, selectionCoords);

    const nodeInCoords =
        (selectionCoords, astNode) =>
            coordsContainedIn(selectionCoords, astNode.loc);

    function nodeMatchesCoords(selectionCoords, astNode) {
        const isNodeMatch = selectionCoords.start.line === astNode.loc.start.line
            && selectionCoords.start.column === astNode.loc.start.column
            && selectionCoords.end.line === astNode.loc.end.line
            && selectionCoords.end.column === astNode.loc.end.column;

        return isNodeMatch;
    }

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
        const traversal = {
            enter: functionOrDefault(traversalOptions.enter),
            leave: functionOrDefault(traversalOptions.leave),
            fallback: 'iteration'
        }

        estraverse.traverse(ast, traversal);
    }

    return {
        coordsInNode: typeHelper.enforce(
            'selectionCoords, astNode => boolean',
            coordsInNode),

        nodeInCoords: typeHelper.enforce(
            'selectionCoords, astNode => boolean',
            nodeInCoords),

        nodeMatchesCoords: typeHelper.enforce(
            'selectionCoords, astNode => boolean',
            nodeMatchesCoords),

        isNodeType: typeHelper.enforce(
            'nodeTypes => astNode => boolean',
            isNodeType),

        onMatch: typeHelper.enforce(
            `nodeMatchCheck:function, nodeAction:function 
            => astNode
            => undefined`,
            onMatch),

        traverse: typeHelper.enforce(
            'astNode, traversalOptions => undefined',
            traverse)
    };

}

module.exports = astHelper;