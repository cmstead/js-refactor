'use strict';

const assert = require('chai').assert;
const container = require('../../../container.js');
const testUtils = require('../../test-utils/test-utils');

require('../../test-utils/approvalsConfig');

describe('coordsHelper', function () {

    let coordsHelper;

    beforeEach(function () {
        coordsHelper = container.build('coordsHelper');
    });

    describe('coordsFromDocumentToEditor', function () {

        it('should convert VS Code document selection coordinates to editor format', function () {
            const editorCoords = {
                _start: {
                    _line: 0,
                    _character: 0
                },
                _end: {
                    _line: 10,
                    _character: 11
                }
            };

            const documentCoords = coordsHelper.coordsFromDocumentToEditor(editorCoords);

            this.verify(testUtils.prettyJson(documentCoords));
        });

    });

    describe('coordsFromEditorToDocument', function () {

        it('should convert VS Code editor coordinates to document format', function () {
            const documentCoords = {
                start: [0, 0],
                end: [10, 11]
            };

            const editorCoords = coordsHelper.coordsFromEditorToDocument(documentCoords);

            this.verify(testUtils.prettyJson(editorCoords));
        });

    });

    describe('coordsFromEditorToAst', function () {

        it('should convert VS Code editor selection coordinates to AST format', function () {
            const editorCoords = {
                start: [0, 0],
                end: [10, 11]
            };

            const astCoords = coordsHelper.coordsFromEditorToAst(editorCoords);

            this.verify(testUtils.prettyJson(astCoords));
        });

    });

    describe('coordsFromAstToEditor', function () {

        it('should convert AST formatted coords to editor coords', function () {
            const astCoords = {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 11,
                    column: 13
                }
            };

            const editorCoords = coordsHelper.coordsFromAstToEditor(astCoords);

            this.verify(testUtils.prettyJson(editorCoords));
        });
    });

});