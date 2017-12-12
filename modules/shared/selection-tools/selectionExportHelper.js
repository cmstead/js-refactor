'use strict';

function selectionExportHelper(
    astHelper,
    typeHelper
) {

    const isMemberExpressionNode = astHelper.isNodeType(['MemberExpression']);

    function isExportNode(node) {
        if(isMemberExpressionNode(node)) {
            console.log(node);
        }

        return false;
    }

    function getExportNode(ast) {
        let currentNode = null;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isExportNode,
                (node) => currentNode = node
            )
        });

        return currentNode;
    }

    return {
        getExportNode: typeHelper.enforce(
            'ast => variant<null, astNode>',
            getExportNode)
    };

}

module.exports = selectionExportHelper;