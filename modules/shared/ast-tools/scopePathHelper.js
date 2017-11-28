'use strict';

function scopePathHelper(astHelper) {

    const isScopePath = astHelper.isNodeType(['ObjectExpression', 'FunctionExpression']);

    const isScopePathElement =
        (coords) =>
            (node) =>
                astHelper.coordsInNode(coords, node)
                && isScopePath(node);

    function buildScopePath(coords, ast) {
        const scopePath = [ast];
        const capturePath = (node) => scopePath.push(node);

        astHelper.traverse(ast, {
            enter: astHelper.onMatch(isScopePathElement(coords), capturePath)
        });

        return scopePath;
    }

    return {
        buildScopePath: buildScopePath
    };
}

module.exports = scopePathHelper;