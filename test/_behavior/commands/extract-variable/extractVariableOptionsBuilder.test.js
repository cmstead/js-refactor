const approvals = require('../../test-utils/approvals');
const jsAstFixtureLoader = require('../../test-utils/jsAstFixtureLoader');
const jsSourceFixtureLoader = require('../../test-utils/jsSourceFixtureLoader');
const prettyJson = require('../../test-utils/prettyJson');

const container = require('../../../../container');

const basePath = jsAstFixtureLoader.buildPath(__dirname, './fixtures');

approvals.init();

describe('Extract Variable Options Builder', function () {

    let astFixture;
    let sourceFixture;
    let extractVariableOptionsBuilder;
    let variableExtractionLocationFinder;
    let variableExtractionScopeFinder;

    beforeEach(function () {
        const testContainer = container.new();

        variableExtractionLocationFinder = testContainer.build('variableExtractionLocationFinder');
        variableExtractionScopeFinder = testContainer.build('variableExtractionScopeFinder');

        astFixture = jsAstFixtureLoader.load(basePath, 'extraction-location-fixture.js');
        sourceFixture = jsSourceFixtureLoader.loadLines(basePath, 'extraction-location-fixture.js');

        extractVariableOptionsBuilder = testContainer.build('extractVariableOptionsBuilder');
    });

    describe('Scope Options', function () {

        it('returns a list of scopes the extraction can be written to', function () {
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

            const scopeOptionsList = extractVariableOptionsBuilder.getScopeOptions(foundScopePath, sourceFixture);

            this.verify(prettyJson(scopeOptionsList));
        });

    });

});