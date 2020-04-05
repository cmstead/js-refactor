const { assert } = require('chai');
const gwt = require('fluent-gwt').configure({});
const buildAstFixture = require('../../buildAstFixture');

const container = require('../../../../container');

describe.only("Selection utilities and expression discovery", function () {

    let selectionExpressionHelper;
    let astFixture;

    beforeEach(function () {
        const testContainer = container.new();

        astFixture = buildAstFixture('arrow-function-fixture', testContainer);

        selectionExpressionHelper = testContainer.build('selectionExpressionHelper');
    });


    describe('Get nearest arrow function', function () {

        it('returns null when ast coordinates are not positioned within an arrow function', function () {
            return gwt
                .given(
                    'ast coordinates are not in an arrow function expression',
                    () => ({
                        start: {
                            line: 1,
                            column: 0
                        },
                        end: {
                            line: 1,
                            column: 0
                        }
                    })
                )
                .when(
                    'arrow function attempt is made',
                    (selectionCoordinates) => selectionExpressionHelper
                        .getNearestArrowFunction(selectionCoordinates, astFixture)
                )
                .then(
                    'null is returned',
                    (result) => assert.equal(result, null, 'Resulting output was not null')
                )
        });

        it('returns arrow function ast node when coordinates are in a stand-alone arrow function', function () {
            return gwt
                .given(
                    'selection coordinates are within a standalone arrow function',
                    () => ({
                        start: {
                            line: 1,
                            column: 29
                        },
                        end: {
                            line: 1,
                            column: 29
                        }
                    })
                )
                .when(
                    'running arrow function discovery',
                    (selection) => selectionExpressionHelper
                        .getNearestArrowFunction(selection, astFixture)
                )
                .then(
                    'returns arrow function ast node',
                    (result) => {
                        const expectedLocation = {
                            start: {
                                line: 1,
                                column: 26
                            },
                            end: {
                                line: 1,
                                column: 36
                            }
                        };

                        const actualLocation = result.loc;

                        assert.equal(JSON.stringify(actualLocation), JSON.stringify(expectedLocation), 'Locations did not match, arrow function was not found correctly');
                    }
                )
        });

    });

});