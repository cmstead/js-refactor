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

        it('returns null when cursor is not positioned within an arrow function', function () {
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

        it('returns arrow function node when cursor is in a stand-alone arrow function', function () {
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
                    'correct arrow function ast node is returned',
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

        it('returns nested arrow function when cursor is inside inner arrow function', function () {
            return gwt
                .given(
                    'the cursor is inside a nested arrow function',
                    () => ({
                        start: {
                            line: 2,
                            column: 37
                        },
                        end: {
                            line: 2,
                            column: 37
                        }
                    })
                )
                .when(
                    'locating arrow function at cursor',
                    (cursorPosition) => selectionExpressionHelper
                        .getNearestArrowFunction(cursorPosition, astFixture)
                )
                .then(
                    'inner arrow function node is returned',
                    (result) => {
                        const expectedLocation = {
                            start: {
                                line: 2,
                                column: 34
                            },
                            end: {
                                line: 2,
                                column: 44
                            }
                        };

                        const actualLocation = result.loc;

                        assert.equal(JSON.stringify(actualLocation), JSON.stringify(expectedLocation), 'Locations did not match, arrow function was not correctly found');
                    }
                )
        });

    });

});