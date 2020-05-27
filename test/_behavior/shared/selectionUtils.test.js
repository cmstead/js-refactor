const approvals = require('../test-utils/approvals');
const jsSourceFixtureLoader = require('../test-utils/jsSourceFixtureLoader');
const prettyJson = require('../test-utils/prettyJson');

const container = require('../../../container');

const basePath = jsSourceFixtureLoader.buildPath(__dirname, 'fixtures');

describe('Selection Utils', function () {

    describe('get selection', function () {

        let sourceLines;
        let selectionUtils;

        beforeEach(function () {
            const testContainer = container.new();

            sourceLines = jsSourceFixtureLoader.loadLines(basePath, 'selectionUtils.js');

            selectionUtils = testContainer.build('selectionUtils');
        });

        it('returns a whole, single-line selection', function () {
            const coordinates = {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 30
                }
            };

            const selectedText = selectionUtils.getSelection(coordinates, sourceLines);

            this.verify(selectedText);
        });

        it('returns a partial, single-line selection', function () {
            const coordinates = {
                start: {
                    line: 1,
                    column: 12
                },
                end: {
                    line: 1,
                    column: 28
                }
            };

            const selectedText = selectionUtils.getSelection(coordinates, sourceLines);

            this.verify(selectedText);
        });

        it('returns a multi-line, whole-line selection', function () {
            const coordinates = {
                start: {
                    line: 5,
                    column: 0
                },
                end: {
                    line: 7,
                    column: 3
                }
            };

            const selectedText = selectionUtils.getSelection(coordinates, sourceLines);

            this.verify(selectedText);
        });

        it('returns a multi-line, partial-line selection', function () {
            const coordinates = {
                start: {
                    line: 5,
                    column: 22
                },
                end: {
                    line: 7,
                    column: 1
                }
            };

            const selectedText = selectionUtils.getSelection(coordinates, sourceLines);

            this.verify(selectedText);
        });

    });

});