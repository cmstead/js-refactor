'use strict';

var babylon = require('babylon');
var babelCore = require('babel-core');

var j = require('jfp');

const babylonPlugins = [
    'estree',
    'jsx',
    'flow',
    'doExpressions',
    'objectRestSpread',
    'decorators',
    'classProperties',
    'exportExtensions',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
    'templateInvalidEscapes'
];

function scopeFinder() {
    function coordsFromEditorToAst(vsCodeCoords) {
        return {
            start: [vsCodeCoords.start[0] + 1, vsCodeCoords.start[1]],
            end: [vsCodeCoords.end[0] + 1, vsCodeCoords.end[1]]
        };
    }

    function coordsFromAstToEditor(astCoords) {
        return {
            start: [astCoords.start.line - 1, astCoords.start.column],
            end: [astCoords.end.line - 1, astCoords.end.column]
        };
    }

    function coordsBodyToContent(bodyCoords) {
        return {
            start: {
                line: bodyCoords.start.line,
                column: bodyCoords.start.column
            },
            end: {
                line: bodyCoords.end.line,
                column: bodyCoords.end.column
            }
        };
    }

    function coordsWithin(coords, node) {
        const nodeStart = node.loc.start;
        const nodeEnd = node.loc.end;

        const afterStartLine = coords.start[0] > nodeStart.line;
        const afterStartCharacter = coords.start[0] === nodeStart.line && coords.start[1] >= nodeStart.column;

        const beforeEndLine = coords.end[0] < nodeEnd.line;
        const beforeEndCharacter = coords.end[0] === nodeEnd.line && coords.end[1] <= nodeEnd.column;

        return (afterStartLine || afterStartCharacter) && (beforeEndLine || beforeEndCharacter);
    }

    function babylonParse(source) {
        try {
            return babylon.parse(source, { sourceType: 'script', plugins: babylonPlugins });
        } catch (e) {
            return babylon.parse(source, { sourceType: 'module', plugins: babylonPlugins });
        }
    }

    function getAst(source) {
        try {
            return babylonParse(source);
        } catch (e) {
            // Babylon doesn't currently have production-ready typescript parsing
            // and the typescript module docs are tremendously frustrating
            // so for now, if something goes really wrong, we pass null.
            return null;
        }
    }

    function findFunctionNodeInAst(ast, selectionCoords) {
        let matchedScope = null;
        let lastScope = null;

        babelCore.traverse(ast, {
            enter: function(nodePath) {
                lastScope = /(Function|MethodDefinition)/.test(nodePath.type) ? nodePath.node : lastScope;
                matchedScope = coordsWithin(selectionCoords, nodePath.node) ? lastScope : matchedScope;
            }
        });

        return matchedScope;
    }

    function findScopeCoordsInAst(ast, selectionCoords) {
        let matchedScope = findFunctionNodeInAst(ast, selectionCoords);
        let body = typeof matchedScope.body !== 'undefined' ? matchedScope.body : matchedScope.value.body;

        return body.loc;
    }

    function findTokenCoordsInTokens(tokens, selectionCoords) {
        let matchedToken = null;

        tokens.forEach(token => {
            if (coordsWithin(selectionCoords, token)) {
                matchedToken = token;
                return false;
            }
        });

        return matchedToken;
    }

    function buildVariableDef(token) {
        let tokenOk = token !== null && token.type.label === 'name';

        let defaultCoords = {
            start: [0, 0],
            end: [0, 0]
        };

        return {
            variableName: tokenOk ? token.value : '',
            variableCoords: tokenOk ? coordsFromAstToEditor(token.loc) : defaultCoords
        };
    }

    function findVariableAndCoords(source, inputCoords) {
        let ast = getAst(source);
        let tokens = ast.tokens;
        let selectionCoords = coordsFromEditorToAst(inputCoords);

        let token = findTokenCoordsInTokens(tokens, selectionCoords);
        return buildVariableDef(token);
    }

    function findVariableCoords(source, inputCoords) {
        var variableDef = findVariableAndCoords(source, inputCoords);
        return variableDef.variableName === '' ? null : variableDef.variableCoords;
    }

    function findScopeCoords(source, inputCoords) {
        let ast = getAst(source);
        let selectionCoords = coordsFromEditorToAst(inputCoords);
        let loc = findScopeCoordsInAst(ast, selectionCoords);

        return j.compose(coordsFromAstToEditor, coordsBodyToContent)(loc);
    }

    function buildSourceCoords(source) {
        let sourceLines = source.split('\n');
        let sourceLinesLastIndex = sourceLines.length - 1;
        return {
            start: [0, 0],
            end: [sourceLinesLastIndex, sourceLines[sourceLinesLastIndex].length - 1]
        };
    }

    function findFunctionCoords(source, inputCoords) {
        let ast = getAst(source);
        let selectionCoords = coordsFromEditorToAst(inputCoords);
        let functionNode = findFunctionNodeInAst(ast, selectionCoords);

        if (functionNode !== null) {
            return coordsFromAstToEditor(functionNode.loc);
        } else {
            return buildSourceCoords(source);
        }
    }

    return {
        findFunctionCoords: findFunctionCoords,
        findScopeCoords: findScopeCoords,
        findVariableAndCoords: findVariableAndCoords,
        findVariableCoords: findVariableCoords
    };
}

module.exports = scopeFinder;
