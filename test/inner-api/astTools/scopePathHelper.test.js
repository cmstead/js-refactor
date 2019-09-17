'use strict';

const fs = require('fs');
const container = require('../../../container');

const testUtils = require('../../test-utils/test-utils');
const motherContainer = require('../../test-utils/mother-container');
require('../../test-utils/approvalsConfig');

describe('scopePathHelper', function () {

    let astFixture;
    let coordsHelper;
    let scopePathHelper;
    let activeEditor;

    beforeEach(function () {
        const subcontainer = container.new();

        const loggerFake = {
            error: () => {}
        }

        subcontainer.register(() => loggerFake, 'logger');

        activeEditor = motherContainer.buildData('activeTextEditor');

        const vsCodeHelperFactoryFake = function () {
            return {
                getActiveEditor: () => activeEditor
            }
        };

        subcontainer.register(() => vsCodeHelperFactoryFake, 'vsCodeHelperFactory');

        coordsHelper = subcontainer.build('coordsHelper');
        const parser = subcontainer.build('parser');

        const testSource = fs.readFileSync('./test/fixtures/scopePathHelper/scopePathHelper.js', 'utf8');

        astFixture = parser.parse(testSource);

        scopePathHelper = subcontainer.build('scopePathHelper');
    });

    describe('buildScopePath', function () {

        it('should build a correct scope path', function () {
            const editorCoords = {
                start: [7, 24],
                end: [7, 27]
            };
            const coords = coordsHelper.coordsFromEditorToAst(editorCoords);

            const scopePath = scopePathHelper.buildScopePath(coords, astFixture);
            const scopePathTypes = scopePath.map(node => node.type);

            this.verify('Constructed scope path types: \n' + testUtils.prettyJson(scopePathTypes));
        });

    });

});