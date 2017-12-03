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
            const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
            const ast = parser.parseSourceLines(sourceTokens);

            const astCoords = {
                start: {
                    line: 6,
                    column: 12
                },
                end: {
                    line: 9,
                    column: 13
                }
            };

            const unboundVars = selectionVariableHelper.getUnboundVars(astCoords, ast);

            this.verify(prettyJson(unboundVars));
        });

    });

});