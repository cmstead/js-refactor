const approvals = require('../test-utils/approvals');
const jsAstFixtureLoader = require('../test-utils/jsAstFixtureLoader');
const prettyJson = require('../test-utils/prettyJson');

const container = require('../../../container');

const basePath = jsAstFixtureLoader.buildPath(__dirname, './fixtures');

approvals.init();

describe('Find extraction location', function () {

    let scopePath;
    let variableExtractionLocationFinder;

    beforeEach(function(){
        const testContainer = container.new();
        
        const astFixture = jsAstFixtureLoader.load(basePath, 'extraction-location-fixture.js');

        const variableExtractionScopeFinder = testContainer.build('variableExtractionScopeFinder');
        scopePath = variableExtractionScopeFinder.findScopePath({
            start: {
                line: 4,
                column: 24
            },
            end: {
                line: 4,
                column: 40
            }
        }, astFixture);

        variableExtractionLocationFinder = testContainer.build('variableExtractionLocationFinder');
    });

    it('returns the first position of the first line for extraction', function () {
        const parentNode = null;
        const childPosition = scopePath[0].loc;

        const extractionLocation = variableExtractionLocationFinder.getExtractionLocation(parentNode, childPosition);

        this.verify(prettyJson(extractionLocation));
    });

    it('returns the position at the beginning of the return statement in scopePath[1]', function () {
        const parentNode = scopePath[0];
        const childPosition = scopePath[1].loc;

        const extractionLocation = variableExtractionLocationFinder.getExtractionLocation(parentNode, childPosition);

        this.verify(prettyJson(extractionLocation));
    });

    it('returns the position at the beginning of the property name in scopePath[2]', function() {
        throw new Error('Start here');
    })
});