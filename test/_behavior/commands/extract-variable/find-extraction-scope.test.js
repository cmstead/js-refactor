const approvals = require('../../test-utils/approvals');
const jsAstFixtureLoader = require('../../test-utils/jsAstFixtureLoader');
const prettyJson = require('../../test-utils/prettyJson');

const container = require('../../../../container');

const basePath = jsAstFixtureLoader.buildPath(__dirname, './fixtures');

approvals.init();

describe('Find Extraction Scope', function() {

    let astFixture;
    let variableExtractionScopeFinder;

    beforeEach(function() {
        const testContainer = container.new();
        
        variableExtractionScopeFinder = testContainer.build('variableExtractionScopeFinder');
        astFixture = jsAstFixtureLoader.load(basePath, 'extraction-scope-fixture.js');
    });

    
    it('returns file scope when value to extract is not in any other structure', function () {
        const coordinates = {
            start: {
                line: 1,
                column: 12
            },
            end: {
                line: 1,
                column: 17
            }
        };

        const foundScopePath = variableExtractionScopeFinder.findScopePath(coordinates, astFixture);

        const scopeInfo = {
            scopeLength: foundScopePath.length,
            startLocation: foundScopePath[0].loc.start
        }

        this.verify(prettyJson(scopeInfo));
    });

    it('returns a scope path with root and function when value is in a function', function () {
        const coordinates = {
            start: {
                line: 4,
                column: 16
            },
            end: {
                line: 4,
                column: 32
            }
        };

        const foundScopePath = variableExtractionScopeFinder.findScopePath(coordinates, astFixture);

        const scopeInfo = foundScopePath.map((node, index) => ({
            nodeIndex: index,
            nodeType: node.type,
            nodeStart: node.loc.start}));

        this.verify(prettyJson(scopeInfo));
    });

    it('returns a scope path like the following: [root, object, function expression] when structure is nested as described', function () {
        const coordinates = {
            start: {
                line: 9,
                column: 20
            },
            end: {
                line: 9,
                column: 38
            }
        };

        const foundScopePath = variableExtractionScopeFinder.findScopePath(coordinates, astFixture);

        const scopeInfo = foundScopePath.map((node, index) => ({
            nodeIndex: index,
            nodeType: node.type,
            nodeStart: node.loc.start
        }));

        this.verify(prettyJson(scopeInfo));
    });

    it('returns a scope path including an arrow function', function () {
        const coordinates = {
            start: {
                line: 14,
                column: 16
            },
            end: {
                line: 14,
                column: 42
            }
        };

        const foundScopePath = variableExtractionScopeFinder.findScopePath(coordinates, astFixture);

        const scopeInfo = foundScopePath.map((node, index) => ({
            nodeIndex: index,
            nodeType: node.type,
            nodeStart: node.loc.start
        }));

        this.verify(prettyJson(scopeInfo));
    });

    it('returns a scope which does not include a single-line arrow function', function () {
        const coordinates = {
            start: {
                line: 17,
                column: 51
            },
            end: {
                line: 17,
                column: 80
            }
        };

        const foundScopePath = variableExtractionScopeFinder.findScopePath(coordinates, astFixture);

        const scopeInfo = foundScopePath.map((node, index) => ({
            nodeIndex: index,
            nodeType: node.type,
            nodeStart: node.loc.start
        }));

        this.verify(prettyJson(scopeInfo));
    });

    it('returns a scope which includes a conditional block', function () {
        const coordinates = {
            start: {
                line: 20,
                column: 16
            },
            end: {
                line: 20,
                column: 49
            }
        };

        const foundScopePath = variableExtractionScopeFinder.findScopePath(coordinates, astFixture);

        const scopeInfo = foundScopePath.map((node, index) => ({
            nodeIndex: index,
            nodeType: node.type,
            nodeStart: node.loc.start
        }));

        this.verify(prettyJson(scopeInfo));
    });
});