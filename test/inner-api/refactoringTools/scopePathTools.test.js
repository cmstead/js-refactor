'use strict';

const container = require('../../../container');
const readSource = require('../../test-utils/read-source');
const prettyJson = require('../../test-utils/test-utils').prettyJson;

require('../../test-utils/approvalsConfig');

describe('scopePathTools', function () {

    let scopePathHelper;
    let scopePathTools;
    let parser;

    beforeEach(function() {
        const subcontainer = container.new();
        
        const loggerFake = {
            error: () => {}
        }

        subcontainer.register(() => loggerFake, 'logger');
        
        scopePathHelper = subcontainer.build('scopePathHelper');
        scopePathTools = subcontainer.build('scopePathTools');
        parser = subcontainer.build('parser');
    });

    describe('getInitialLineData', function () {

        it('should get the initial lines from an array of scope paths', function () {
            const sourceLines = readSource('./test/fixtures/extractMethod/extractMethod.js');
            const ast = parser.parseSourceLines(sourceLines);
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

            const scopePath = scopePathHelper.buildScopePath(astCoords, ast);

            const initialLineData = scopePathTools.getInitialLineData(scopePath, sourceLines);

            this.verify(prettyJson(initialLineData));
        });

    });

});
