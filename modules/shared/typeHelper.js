'use strict';

const signet = require('signet')();


(function () {

    const commonNativeIdentifiers = require('../json/commonNativeIdentifiers.json');

    function isNonNativeIdentifier(node) {
        return (node.type === 'Identifier'
            && commonNativeIdentifiers.indexOf(node.name) === -1)
            || (node.type === 'MemberExpression'
                && commonNativeIdentifiers.indexOf(node.object.name) === -1);
    }

    signet.defineDuckType('documentPosition', {
        _line: 'leftBoundedInt<0>',
        _character: 'leftBoundedInt<0>'
    });

    signet.defineDuckType('documentCoords', {
        _start: 'documentPosition',
        _end: 'documentPosition'
    });

    signet.alias('editorPosition', 'tuple<leftBoundedInt<0>, leftBoundedInt<0>>');

    signet.defineDuckType('editorCoords', {
        start: 'editorPosition',
        end: 'editorPosition'
    });

    signet.defineDuckType('astPosition', {
        line: 'leftBoundedInt<1>',
        column: 'leftBoundedInt<0>'
    });

    signet.defineDuckType('astCoords', {
        start: 'astPosition',
        end: 'astPosition'
    });

    signet.defineDuckType('astNode', {
        type: '?string',
        loc: 'astCoords'
    });

    signet.subtype('astNode')('nonNativeIdentifier', isNonNativeIdentifier);

    signet.defineDuckType('ast', {
        type: 'formattedString<Program>',
        loc: 'astCoords'
    });

    signet.alias('scopePath', 'array<astNode>');

    signet.defineDuckType('scopePathInitialLineObject', {
        type: 'string',
        initialLine: 'string'
    });

    signet.alias('scopePathInitialLineData', 'array<scopePathInitialLineObject>');

    signet.alias('selectionCoords', 'astCoords');
    signet.alias('selectedOptionIndex', 'leftBoundedInt<0>');

    signet.alias('sourceText', 'string');
    signet.alias('sourceLines', 'array<string>');

    signet.alias('unboundVars', 'array<string>');

    signet.alias('nodeTypes', 'array<string>');

    signet.defineDuckType('traversalOptions', {
        enter: '?function<astNode => undefined>',
        leave: '?function<astNode => undefined>'
    });

})();


function errorBuilder(validationResult, args, signatureTree, functionName) {
    const defaultError = signet.buildInputErrorMessage(validationResult, args, signatureTree, functionName);
    return defaultError + '\n\nJS Refactoring types are defined in the typeHelper file; more info can be found in type definitions.';
}

function enforce(signature, fn) {
    return signet.enforce(signature, fn, {
        inputErrorBuilder: errorBuilder,
        outputErrorBuilder: errorBuilder
    });
}

function typeHelper() {
    return {
        enforce: enforce,
        isTypeOf: signet.isTypeOf
    };
}

module.exports = typeHelper;