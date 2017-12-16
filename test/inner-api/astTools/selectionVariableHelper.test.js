'use strict';

const container = require('../../../container');

let readSource = require('../../test-utils/read-source');
let prettyJson = require('../../test-utils/test-utils').prettyJson;

require('../../test-utils/approvalsConfig');

describe('selectionVariableHelper', function() {
    
    let subcontainer;
    let selectionVariableHelper;
    let parser;

    beforeEach(function() {
        subcontainer = container.new();
        parser = subcontainer.build('parser');
        selectionVariableHelper = subcontainer.build('selectionVariableHelper');
    });

    describe('getUnboundVars', function() {
        
        it('should return unbound variable data when given astCoords and ast data', function() {
            const sourceTokens = readSource('./test/fixtures/unboundVars/unboundVars.js');
            const ast = parser.parseSourceLines(sourceTokens);

            const selectionAstCoords = {
                start: {
                    line: 8,
                    column: 12
                },
                end: {
                    line: 19,
                    column: 13
                }
            };

            const destinationAstCoords = {
                start: {
                    line: 6,
                    column: 16
                },
                end: {
                    line: 12,
                    column: 5
                }
            };

            const unboundVars = selectionVariableHelper.getUnboundVars(selectionAstCoords, destinationAstCoords, ast);

            this.verify(prettyJson(unboundVars));
        });

    });

});