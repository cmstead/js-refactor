'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');

const container = require('../../../container');
const motherContainer = require('../../test-utils/mother-container');
const testUtils = require('../../test-utils/test-utils');

require('../../test-utils/approvalsConfig');

describe('astHelper', function () {

    let astHelper;
    let estraverseFake;

    beforeEach(function () {
        const subcontainer = container.new();

        estraverseFake = {
            traverse: sinon.spy()
        };

        function estraverse() {
            return estraverseFake;
        }

        subcontainer.register(estraverse);

        astHelper = subcontainer.build('astHelper');
    });

    describe('coordsInNode', function() {
        
        it('should return true if coords are within the scope of the AST node', function() {
            const selectionCoords = {
                start: {
                    line: 10,
                    column: 0
                },
                end: {
                    line: 11,
                    column: 12
                }
            };

            const astNode = {
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 20,
                        column: 0
                    }
                }
            };

            const result = astHelper.coordsInNode(selectionCoords, astNode);

            assert.isTrue(result);
        });

        it('should return true if coords are the same as the scope of the AST node', function() {
            const selectionCoords = {
                start: {
                    line: 10,
                    column: 0
                },
                end: {
                    line: 11,
                    column: 12
                }
            };

            const astNode = {
                loc: {
                    start: {
                        line: 10,
                        column: 0
                    },
                    end: {
                        line: 11,
                        column: 12
                    }
                }
            };

            const result = astHelper.coordsInNode(selectionCoords, astNode);

            assert.isTrue(result);
        });

        it('should return true if coords are on the leading edge of the scope of the AST node', function() {
            const selectionCoords = {
                start: {
                    line: 10,
                    column: 0
                },
                end: {
                    line: 11,
                    column: 12
                }
            };

            const astNode = {
                loc: {
                    start: {
                        line: 10,
                        column: 0
                    },
                    end: {
                        line: 20,
                        column: 12
                    }
                }
            };

            const result = astHelper.coordsInNode(selectionCoords, astNode);

            assert.isTrue(result);
        });

        it('should return true if coords are on the trailing edge of the scope of the AST node', function() {
            const selectionCoords = {
                start: {
                    line: 10,
                    column: 0
                },
                end: {
                    line: 11,
                    column: 12
                }
            };

            const astNode = {
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 11,
                        column: 12
                    }
                }
            };

            const result = astHelper.coordsInNode(selectionCoords, astNode);

            assert.isTrue(result);
        });

        it('should return false if coords are not within the scope of the AST node', function() {
            const selectionCoords = {
                start: {
                    line: 10,
                    column: 0
                },
                end: {
                    line: 11,
                    column: 12
                }
            };

            const astNode = {
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 5,
                        column: 0
                    }
                }
            };

            const result = astHelper.coordsInNode(selectionCoords, astNode);

            assert.isFalse(result);
        });

    });

    describe('isNodeType', function () {

        it('should return true when a node match is found', function () {
            const isFunctionExpression = astHelper.isNodeType(['FunctionExpression']);

            const astNode = motherContainer.buildData('astNode');
            astNode.type = 'FunctionExpression';

            const result = isFunctionExpression(astNode);

            assert.isTrue(result);
        });

        it('should correctly match on multiple properties', function () {
            const isFunctionExpression = astHelper.isNodeType(['FunctionExpression', 'ObjectExpression']);

            const functionNode = motherContainer.buildData('astNode');
            functionNode.type = 'FunctionExpression';

            const objectNode = motherContainer.buildData('astNode');
            objectNode.type = 'ObjectExpression';

            const otherNode = motherContainer.buildData('astNode');

            const result = [functionNode, objectNode, otherNode].map(isFunctionExpression);

            this.verify(testUtils.prettyJson(result));
        });

        it('should return true when a node match is found', function () {
            const isFunctionExpression = astHelper.isNodeType(['FunctionExpression']);

            const astNode = motherContainer.buildData('astNode');
            astNode.type = 'NonMatchingNode';

            const result = isFunctionExpression(astNode);

            assert.isFalse(result);
        });

    });

    describe('onMatch', function () {

        it('should call action when test condition is matched', function () {
            const isFunctionExpression = astHelper.isNodeType(['FunctionExpression']);
            const actionSpy = sinon.spy();

            const callSpyOnMatch = astHelper.onMatch(isFunctionExpression, actionSpy);

            const functionNode = motherContainer.buildData('astNode');
            functionNode.type = 'FunctionExpression';

            callSpyOnMatch(functionNode);

            this.verify('Action called with astNode: \n' + testUtils.prettyJson(actionSpy.args));
        });

        it('should not call action when test condition is not matched', function () {
            const isFunctionExpression = astHelper.isNodeType(['FunctionExpression']);
            const actionSpy = sinon.spy();

            const callSpyOnMatch = astHelper.onMatch(isFunctionExpression, actionSpy);

            const functionNode = motherContainer.buildData('astNode');

            callSpyOnMatch(functionNode);

            this.verify('Action not called: \n' + testUtils.prettyJson(actionSpy.args));
        });

    });

    describe('traverse', function () {
        it('should call estraverse.traverse with properly formed traversal object', function () {
            function enterFake() { }
            function leaveFake() { }

            const traversalOptions = {
                enter: enterFake,
                leave: leaveFake
            };

            const ast = motherContainer.buildData('ast');

            astHelper.traverse(ast, traversalOptions);

            this.verify('Estraverse was called with given functions: \n'
                + testUtils.prettyJson(estraverseFake.traverse.args));
        });

        it('should use default functions for missing enter or leave functions', function () {
            const emptyOptions = {};

            const ast = motherContainer.buildData('ast');

            astHelper.traverse(ast, emptyOptions);

            this.verify('Estraverse was called with default functions: \n'
                + testUtils.prettyJson(estraverseFake.traverse.args));
        });
    });

});