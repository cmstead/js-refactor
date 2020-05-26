function nodeTypeMap () {
    return {
        ARROW_FUNCTION_EXPRESSION: 'ArrowFunctionExpression',
        ASSIGNMENT_EXPRESSION: 'AssignmentExpression',
        CALL_EXPRESSION: 'CallExpression',
        BLOCK_STATEMENT: 'BlockStatement',
        FUNCTION_DECLARATION: 'FunctionDeclaration',
        FUNCTION_EXPRESSION: 'FunctionExpression',
        IF_STATEMENT: 'IfStatement',
        OBJECT_EXPRESSION: 'ObjectExpression',
        PROPERTY: 'Property',
        RETURN_STATEMENT: 'ReturnStatement',
        VARIABLE_DECLARATION: 'VariableDeclaration',
        VARIABLE_DECLARATOR: 'VariableDeclarator'
    };
}

module.exports = nodeTypeMap;