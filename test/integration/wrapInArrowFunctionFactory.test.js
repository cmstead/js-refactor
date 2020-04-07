'use strict';

var mocker = require('../mocker');

var testHelperFactory = require('../test-utils/testHelperFactory');

var readSource = require('../test-utils/read-source');
var prettyJson = require('../test-utils/test-utils').prettyJson;

const selectionBuilder = require('../test-utils/selectionBuilder');
const activeEditorUpdater = require('../test-utils/activeEditorUpdater');

var approvalsConfig = require('../test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

var sinon = require('sinon');

describe('Wrap In Arrow', function () {
    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;

    beforeEach(function () {
        var testHelper = testHelperFactory();

        subcontainer = testHelper.subcontainer;
        applySetEditSpy = testHelper.applySetEditSpy;
        vsCodeProperties = testHelper.vsCodeProperties;

        applySetEditSpy = sinon.spy(function (text, coords) {
            return {
                then: function (callback) {

                }
            };
        });

        mocker.getMock('editActionsFactory').api.applySetEdit = applySetEditSpy;
    });

    it('should log an error if selection is empty', function () {
        var sourceTokens = readSource('./test/fixtures/wrapInWrapper/wrapInWrapper.js');
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
        subcontainer.build('wrapInArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should wrap selection in an arrow function', function () {
        var sourceTokens = readSource('./test/fixtures/wrapInWrapper/wrapInWrapper.js');
        var selections = [
            selectionBuilder.buildSelection([
                [3, 4],
                [5, 5]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('wrapInArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });


});