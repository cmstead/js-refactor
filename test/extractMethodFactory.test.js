'use strict';

var mocker = require('./mocker');
var motherContainer = require('./test-utils/mother-container');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

var sinon = require('sinon');

describe('Extract Method', function () {
    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;

    beforeEach(function () {
        var testHelper = testHelperFactory();

        subcontainer = testHelper.subcontainer;
        applySetEditSpy = testHelper.applySetEditSpy;
        vsCodeProperties = testHelper.vsCodeProperties;

        applySetEditSpy = sinon.spy(function () {
            return {
                then: function (callback) {
                    callback()
                }
            };
        });

        mocker.getMock('editActionsFactory').api.applySetEdit = applySetEditSpy;
    });

    it('should log an error if selection is empty', function () {
        const sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');
        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const infoAction = mocker.getMock('logger').api.info;
        const extractMethodFactory = subcontainer.build('extractMethodFactory');

        const unusedObject = null;
        const callback = function () { };

        extractMethodFactory(unusedObject, callback)();

        this.verify(prettyJson(infoAction.args));
    });

});