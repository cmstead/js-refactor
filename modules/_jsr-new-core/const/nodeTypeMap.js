function nodeTypeMap () {
    return {
        ARROW_FUNCTION_EXPRESSION: 'ArrowFunctionExpression',
        BLOCK_STATEMENT: 'BlockStatement',
        FUNCTION_DECLARATION: 'FunctionDeclaration',
        FUNCTION_EXPRESSION: 'FunctionExpression',
        IF_STATEMENT: 'IfStatement',
        OBJECT_EXPRESSION: 'ObjectExpression',
    };
}

module.exports = nodeTypeMap;