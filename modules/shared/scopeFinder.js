'use strict';

var esprima = require('esprima');
var escope = require('escope');
var estraverse = require('estraverse');
var j = require('jfp');

function scopeFinder() {
    function coordsFromVsCodeToEsprima(vsCodeCoords) {
        return {
            start: [vsCodeCoords.start[0] + 1, vsCodeCoords.start[1]],
            end: [vsCodeCoords.end[0] + 1, vsCodeCoords.end[1]],
        };
    }

    function coordsFromEsprimaToVsCode(esprimaCoords) {
        return {
            start: [esprimaCoords.start.line - 1, esprimaCoords.start.column],
            end: [esprimaCoords.end.line - 1, esprimaCoords.end.column]
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
        }
    }

    function coordsMatch(coords, node) {
        return coords.start[0] === node.loc.start.line &&
            coords.start[1] === node.loc.start.column &&
            coords.end[0] === node.loc.end.line &&
            coords.end[1] === node.loc.end.column;
    }

    function isRootScope (node) {
        return node.type === 'Program';
    }

    function findScopeCoords(source, inputCoords) {
        var ast = esprima.parse(source, { loc: true });
        var scopeManager = escope.analyze(ast);
        var currentScope = scopeManager.acquire(ast);

        var selectionCoords = coordsFromVsCodeToEsprima(inputCoords);

        var matchedScope = null;
        var lastScope = null;

        estraverse.traverse(ast, {
            enter: function (node) {
                lastScope = /Function/.test(node.type) ? node : lastScope;
                matchedScope = coordsMatch(selectionCoords, node) ? lastScope : matchedScope;
            },

            leave: function (node) { }
        });

        return j.compose(
            coordsFromEsprimaToVsCode,
            coordsBodyToContent
        )(matchedScope.body.loc);
    }

    return {
        findScopeCoords: findScopeCoords
    };
}

module.exports = scopeFinder;