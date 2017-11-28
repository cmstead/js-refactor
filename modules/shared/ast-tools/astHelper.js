'use strict';

function astHelper(estraverse, typeHelper) {

    function noOp() { }

    function coordsInNode(selectionCoords, astNode) {
        const nodeStart = astNode.loc.start;
        const nodeEnd = astNode.loc.end;

        const afterStartLine = selectionCoords.start.line > nodeStart.line;
        const afterStartCharacter = selectionCoords.start.line === nodeStart.line
            && selectionCoords.start.column >= nodeStart.column;

        const beforeEndLine = selectionCoords.end.line < nodeEnd.line;
        const beforeEndCharacter = selectionCoords.end.line === nodeEnd.line
            && selectionCoords.end.column <= nodeEnd.column;

        return (afterStartLine || afterStartCharacter) && (beforeEndLine || beforeEndCharacter);
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
            leave: functionOrDefault(traversalOptions.leave)
        }

        estraverse.traverse(ast, traversal);
    }

    return {
        coordsInNode: typeHelper.enforce(
            'selectionCoords, astNode => boolean',
            coordsInNode),

        isNodeType: typeHelper.enforce(
            'nodeTypes => astNode => boolean',
            isNodeType),

        onMatch: typeHelper.enforce(
            `nodeMatchCheck:function, nodeAction:function 
            => astNode
            => undefined`,
            onMatch),

        traverse: typeHelper.enforce(
            'ast, traversalOptions => undefined',
            traverse)
    };

}

module.exports = astHelper;