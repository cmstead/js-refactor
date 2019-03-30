function nodeTypes() {

    const nodeTypes = [
        'ArrayExpression',
        'ArrowFunctionExpression',
        'BinaryExpression',
        'CallExpression',
        'FunctionDeclaration',
        'FunctionExpression',
        'Identifier',
        'IfStatement',
        'Literal',
        'MemberExpression',
        'MethodDefinition',
        'Property',
        'ReturnStatement',
        'VariableDeclaration',
        'VariableDeclarator'
    ];
    
    return nodeTypes.reduce(function(nodeTypeMap, nodeType) {
        nodeTypeMap[nodeType] = nodeType;
        return nodeTypeMap;
    }, {});
}

nodeTypes['@singleton'] = true;

module.exports = nodeTypes;