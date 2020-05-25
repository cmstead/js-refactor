function variableExtractionScopeFinder(
    estraverse,
    nodeTypeMap
) {

    const scopeTypes = [
        nodeTypeMap.ARROW_FUNCTION_EXPRESSION,
        nodeTypeMap.FUNCTION_DECLARATION,
        nodeTypeMap.FUNCTION_EXPRESSION,
        nodeTypeMap.OBJECT_EXPRESSION
    ];

    function compareNodes(coordinatePosition, nodePosition) {
        return nodePosition.line === coordinatePosition.line
            ? coordinatePosition.column - nodePosition.column
            : coordinatePosition.line - nodePosition.line;
    }

    function isSelectionIsInNode(coordinates, node) {
        const startIsWithinNode = compareNodes(coordinates.start, node.loc.start) >= 0;
        const endIsWithinNode = compareNodes(coordinates.end, node.loc.end) <= 0;

        return startIsWithinNode && endIsWithinNode;
    }

    function isValidExtractionNode(node) {
        return node.type !== nodeTypeMap.ARROW_FUNCTION_EXPRESSION
            || node.body.type === nodeTypeMap.BLOCK_STATEMENT;
    }

    function findScopePath(coordinates, ast) {
        let scopePath = [ast.body[0]];

        estraverse.traverse(ast, {
            enter: function (node) {
                if (!isSelectionIsInNode(coordinates, node)) {
                    return this.skip();
                }

                if (
                    scopeTypes.includes(node.type)
                    && isValidExtractionNode(node)
                    && !scopePath.includes(node)
                ) {
                    scopePath.push(node);
                }
            }
        });

        return scopePath;
    }

    return {
        findScopePath
    };
}

module.exports = variableExtractionScopeFinder;