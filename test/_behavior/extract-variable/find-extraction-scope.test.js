const approvals = require('../test-utils/approvals');
const jsAstFixtureLoader = require('../test-utils/jsAstFixtureLoader');
const prettyJson = require('../test-utils/prettyJson');

const container = require('../../../container');

const basePath = jsAstFixtureLoader.buildPath(__dirname, './fixtures');

approvals.init();

describe.only('Find Extraction Scope', function() {

    let testContainer;

    beforeEach(function() {
        testContainer = container.new();
    });

    
    it('returns file scope when value to extract is not in any other structure', function () {
        const variableExtractionScopeFinder = testContainer.build('variableExtractionScopeFinder');
        const astFixture = jsAstFixtureLoader.load(basePath, 'fixture.js');
        const coordinates = {};

        const foundScopePath = variableExtractionScopeFinder.findScopePath(coordinates, astFixture);

        const scopeInfo = {
            scopeLength: foundScopePath.length,
            startLocation: foundScopePath[0].loc.start
        }

        this.verify(prettyJson(scopeInfo));
    });
});