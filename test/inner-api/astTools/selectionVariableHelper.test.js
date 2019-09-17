'use strict';

const container = require('../../test-utils/testContainer');

let readSource = require('../../test-utils/read-source');
let prettyJson = require('../../test-utils/test-utils').prettyJson;

const motherContainer = require('../../test-utils/mother-container');
require('../../test-utils/approvalsConfig');

describe('selectionVariableHelper', function() {
    
    let subcontainer;
    let selectionVariableHelper;
    let parser;
    let activeEditor;

    beforeEach(function() {
        subcontainer = container.new();
        
        const loggerFake = {
            error: () => {}
        }

        subcontainer.register(() => loggerFake, 'logger');

        activeEditor = motherContainer.buildData('activeTextEditor');

        const vsCodeHelperFactoryFake = function () {
            return {
                getActiveEditor: () => activeEditor,
                getFileExtension: () => 'js',
                getLanguageId: () => activeEditor._documentData._languageId
            }
        };

        subcontainer.register(() => vsCodeHelperFactoryFake, 'vsCodeHelperFactory');

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