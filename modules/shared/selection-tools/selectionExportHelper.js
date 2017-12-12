'use strict';

function selectionExportHelper(
    astHelper,
    typeHelper
) {

    const isExpressionStatement = astHelper.isNodeType(['ExpressionStatement']);
    const isAssignmentExpression = astHelper.isNodeType(['AssignmentExpression']);
    const isMemberExpressionNode = astHelper.isNodeType(['MemberExpression']);
    const isObjectExpression = astHelper.isNodeType(['ObjectExpression']);


    function isSimpleExportExpression(node) {
        return node.object.name === 'module'
            && node.property.name === 'exports';
    }

    function isNestedExportExpression(node) {
        return isMemberExpressionNode(node)
            && isSimpleExportExpression(node);
    }

    function isExportExpression(node) {
        return isMemberExpressionNode(node)
            && (isSimpleExportExpression(node)
                || isNestedExportExpression(node.object));
    }

    function isExportExpressionStatement(node) {
        return isExpressionStatement(node)
            && isAssignmentExpression(node.expression)
            && isExportExpression(node.expression.left);
    }

    function isOneLineExport(left, right) {
        return isNestedExportExpression(left.object)
            || !isObjectExpression(right);
    }

    function isMultilineExport(left, right) {
        return isSimpleExportExpression(left)
            && isObjectExpression(right);
    }

    function getExportNode(ast) {
        let currentNode = null;

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(
                isExportExpressionStatement,
                (node) => currentNode = node
            )
        });

        return currentNode;
    }

    return {
        getExportNode: typeHelper.enforce(
            'ast => variant<null, astNode>',
            getExportNode),
        
        isOneLineExport: typeHelper.enforce(
            'left:astNode, right:astNode => boolean',
            isOneLineExport),
        
        isMultilineExport: typeHelper.enforce(
            'left:astNode, right:astNode => boolean',
            isMultilineExport)
    };

}

module.exports = selectionExportHelper;