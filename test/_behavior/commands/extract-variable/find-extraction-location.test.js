const approvals = require('../../test-utils/approvals');
const jsAstFixtureLoader = require('../../test-utils/jsAstFixtureLoader');
const prettyJson = require('../../test-utils/prettyJson');

const container = require('../../../../container');

const basePath = jsAstFixtureLoader.buildPath(__dirname, './fixtures');

approvals.init();

describe('Find extraction location', function () {

    let astFixture;
    let variableExtractionLocationFinder;
    let variableExtractionScopeFinder;

    beforeEach(function () {
        const testContainer = container.new();

        astFixture = jsAstFixtureLoader.load(basePath, 'extraction-location-fixture.js');

        variableExtractionScopeFinder = testContainer.build('variableExtractionScopeFinder');
        variableExtractionLocationFinder = testContainer.build('variableExtractionLocationFinder');
    });

    describe('simple extraction', function() {

        let scopePath;
        let selectionPosition;

        beforeEach(function () {
            selectionPosition = {
                start: {
                    line: 4,
                    column: 24
                },
                end: {
                    line: 4,
                    column: 40
                }
            };

            scopePath = variableExtractionScopeFinder.findScopePath(selectionPosition, astFixture);
        });

        it('returns the first position of the first line for extraction', function () {
            const parentNode = astFixture;
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
    
        it('returns the position at the beginning of the property name in scopePath[2]', function () {
            const parentNode = scopePath[1];
            const childPosition = scopePath[2].loc;
    
            const extractionLocation = variableExtractionLocationFinder.getExtractionLocation(parentNode, childPosition);
    
            this.verify(prettyJson(extractionLocation));
        });
    
        it('returns the position at the beginning of the console.log location', function () {
            const parentNode = scopePath[2];
            const childPosition = selectionPosition;
    
            const extractionLocation = variableExtractionLocationFinder.getExtractionLocation(parentNode, childPosition);
    
            this.verify(prettyJson(extractionLocation));
        });
    });

    describe('complex extraction conditions', function () {

        let scopePath;
        let selectionPosition;

        beforeEach(function () {
            selectionPosition = {
                start: {
                    line: 10,
                    column: 53
                },
                end: {
                    line: 10,
                    column: 58
                }
            };

            scopePath = variableExtractionScopeFinder.findScopePath(selectionPosition, astFixture);
        });

        it('returns the position at the beginning of the outermost if statement', function () {
            const parentNode = scopePath[2];
            const childPosition = scopePath[3].loc;
    
            const extractionLocation = variableExtractionLocationFinder.getExtractionLocation(parentNode, childPosition);
    
            this.verify(prettyJson(extractionLocation));
        });

        it('returns the position at the beginning of the variable declaration', function () {
            const parentNode = scopePath[3];
            const childPosition = selectionPosition;
    
            const extractionLocation = variableExtractionLocationFinder.getExtractionLocation(parentNode, childPosition);
    
            this.verify(prettyJson(extractionLocation));
        });

        it('returns the position at the beginning of the variable assignment', function () {
            selectionPosition = {
                start: {
                    line: 14,
                    column: 24
                },
                end: {
                    line: 14,
                    column: 30
                }
            };

            scopePath = variableExtractionScopeFinder.findScopePath(selectionPosition, astFixture);

            const parentNode = scopePath[3];
            const childPosition = selectionPosition;
    
            const extractionLocation = variableExtractionLocationFinder.getExtractionLocation(parentNode, childPosition);
    
            this.verify(prettyJson(extractionLocation));
        });

        it('returns the position at the beginning of the expression', function () {
            selectionPosition = {
                start: {
                    line: 17,
                    column: 58
                },
                end: {
                    line: 17,
                    column: 67
                }
            };

            scopePath = variableExtractionScopeFinder.findScopePath(selectionPosition, astFixture);

            const parentNode = scopePath[3];
            const childPosition = selectionPosition;
    
            const extractionLocation = variableExtractionLocationFinder.getExtractionLocation(parentNode, childPosition);
    
            this.verify(prettyJson(extractionLocation));
        });
    });

});