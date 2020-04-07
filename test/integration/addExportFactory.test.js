'use strict';

var mocker = require('../mocker');

var testHelperFactory = require('../test-utils/testHelperFactory');

var readSource = require('../test-utils/read-source');
var prettyJson = require('../test-utils/test-utils').prettyJson;

const selectionBuilder = require('../test-utils/selectionBuilder');
const activeEditorUpdater = require('../test-utils/activeEditorUpdater');

var approvalsConfig = require('../test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Add Export', function () {

    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;

    beforeEach(function () {
        var testHelper = testHelperFactory();
        
        subcontainer = testHelper.subcontainer;
        applySetEditSpy = testHelper.applySetEditSpy;
        vsCodeProperties = testHelper.vsCodeProperties;
    });

    it('should log an error if chosen expression is not a variable declaration or function', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-no-exports.js');

        var selections = [
            selectionBuilder.buildSelection([
                [0, 0],
                [0, 0]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('addExportFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should add an export to file source when one does not exist', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-no-exports.js');
        var selections = [
            selectionBuilder.buildSelection([
                [2, 10],
                [2, 10]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('addExportFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should add a single line export to file source if other exports are single line', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-line-exports.js');
        var selections = [
            selectionBuilder.buildSelection([
                [2, 10],
                [2, 10]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('addExportFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should add an export line to existing exported object', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-object-exports.js');
        var selections = [
            selectionBuilder.buildSelection([
                [2, 10],
                [2, 10]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('addExportFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});


