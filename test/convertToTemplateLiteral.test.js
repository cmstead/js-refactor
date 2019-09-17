'use strict';

var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

const selectionBuilder = require('./test-utils/selectionBuilder');
const activeEditorUpdater = require('./test-utils/activeEditorUpdater');

var approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Convert to Template', function () {
    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;

    beforeEach(function () {
        var testHelper = testHelperFactory();

        subcontainer = testHelper.subcontainer;
        applySetEditSpy = testHelper.applySetEditSpy;
        vsCodeProperties = testHelper.vsCodeProperties;
    });

    it('should log an error if selection is not string concatenation', function () {
        var sourceTokens = readSource('./test/fixtures/convertToTemplateLiteral/convertToTemplateLiteral.js');
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
        subcontainer.build('convertToTemplateLiteralFactory')(function () { })();

        this.verify(prettyJson(info.args));

    });

    it('should log an error if expression is binary, but not string concatenation', function () {
        var sourceTokens = readSource('./test/fixtures/convertToTemplateLiteral/convertToTemplateLiteral.js');
        var selections = [
            selectionBuilder.buildSelection([
                [11, 12],
                [11, 27]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('convertToTemplateLiteralFactory')(function () { })();

        this.verify(prettyJson(info.args));

    });

    it('should convert a concatenated string to a template literal', function () {
        var sourceTokens = readSource('./test/fixtures/convertToTemplateLiteral/convertToTemplateLiteral.js');
        var selections = [
            selectionBuilder.buildSelection([
                [9, 13],
                [9, 111]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('convertToTemplateLiteralFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });
});