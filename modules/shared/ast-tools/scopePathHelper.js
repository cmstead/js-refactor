'use strict';

function scopePathHelper(
    astHelper,
    typeHelper
) {

    const scopeElementTypes = [
        'ArrowFunctionExpression',
        'FunctionDeclaration',
        'FunctionExpression',
        'MethodDefinition',
        'ObjectExpression'
    ];

    const methodScopeElementTypes = scopeElementTypes.concat('ClassBody');

    function isBlockOrNotArrowExpression(node) {
        return node.type !== 'ArrowFunctionExpression'
            || node.body.type === 'BlockStatement';
    }

    function isScopePath(elementTypes, node) {
        return astHelper.isNodeType(elementTypes)(node) && isBlockOrNotArrowExpression(node);
    }

    const isScopePathElement =
        (elementTypes, coords) =>
            (node) =>
                astHelper.coordsInNode(coords, node)
                && !astHelper.nodeMatchesCoords(coords, node)
                && isScopePath(elementTypes, node);

    function buildScopePathWithElementTypes(elementTypes, coords, ast) {
        let lastPathNode = null;

        const scopePath = [ast];
        const capturePath = (node) => {
            if (lastPathNode === null || lastPathNode.type !== 'MethodDefinition') {
                scopePath.push(node);
            }

            lastPathNode = node;
        }

        try{
            astHelper.traverse(ast, {
                enter: astHelper.onMatch(
                    isScopePathElement(elementTypes, coords),
                    capturePath
                )
            });    
        } catch(e) {
            console.log('An error occurred', e);
            throw new Error('An error occurred while resolving scope path: ', e.message);
        }

        return scopePath;
    }

    function buildScopePath(coords, ast) {
        return buildScopePathWithElementTypes(scopeElementTypes, coords, ast);
    }

    function buildMethodScopePath(coords, ast) {
        return buildScopePathWithElementTypes(methodScopeElementTypes, coords, ast);
    }

    return {
        buildMethodScopePath: typeHelper.enforce(
            'astCoords, ast => array<astNode>',
            buildMethodScopePath),

        buildScopePath: typeHelper.enforce(
            'astCoords, ast => array<astNode>',
            buildScopePath)
    };
}

module.exports = scopePathHelper;