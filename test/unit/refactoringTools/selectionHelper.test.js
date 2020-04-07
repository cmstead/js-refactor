'use strict';

const container = require('../../test-utils/testContainer');
const readSource = require('../../test-utils/read-source');
const prettyJson = require('../../test-utils/test-utils').prettyJson;

const assert = require('chai').assert;

require('../../test-utils/approvalsConfig');

describe('selectionHelper', function() {
    
    let selectionHelper;

    beforeEach(function() {
        const subcontainer = container.new();

        selectionHelper = subcontainer.build('selectionHelper');
    });

    describe('getSelection', function() {
        
        it('should extract selection from sourceLines using provided editorCoords', function() {
            const sourceLines = readSource('./test/fixtures/extractMethod/extractMethod.js');
            const editorCoords = {
                start: [5, 12],
                end: [8, 13]
            };

            const selectionLines = selectionHelper.getSelection(sourceLines, editorCoords);

            this.verify(prettyJson(selectionLines));
        });

    });

    describe('isEmptySelection', function() {
        
        it('should return true when a selection start and end are the same', function() {
            const editorCoords = {
                start: [3, 3],
                end: [3, 3]
            };

            const result = selectionHelper.isEmptySelection(editorCoords);

            assert.isTrue(result);
        });

        it('should return false when a selection start and end are different', function() {
            const editorCoords = {
                start: [3, 3],
                end: [4, 4]
            };

            const result = selectionHelper.isEmptySelection(editorCoords);

            assert.isFalse(result);
        });

    });

    describe('isMultilineSelection', function() {
        
        it('should return true when start and end line are different', function() {
            const editorCoords = {
                start: [2, 0],
                end: [3, 5]
            };

            const result = selectionHelper.isMultilineSelection(editorCoords);

            assert.isTrue(result);
        });

        it('should return false when start and end line are the same', function() {
            const editorCoords = {
                start: [2, 0],
                end: [2, 5]
            };

            const result = selectionHelper.isMultilineSelection(editorCoords);

            assert.isFalse(result);
        });

    });

});