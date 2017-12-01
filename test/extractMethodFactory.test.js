'use strict';

let mocker = require('./mocker');
let motherContainer = require('./test-utils/mother-container');

let testHelperFactory = require('./test-utils/testHelperFactory');

let readSource = require('./test-utils/read-source');
let prettyJson = require('./test-utils/test-utils').prettyJson;

let approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

let sinon = require('sinon');

describe('Extract Method', function () {

    let applySetEditSpy;
    let subcontainer;
    let vsCodeProperties;

    beforeEach(function () {
        const testHelper = testHelperFactory();

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
        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
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

    it('should provide scope options', function () {
        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [5, 12],
                    end: [7, 13]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const quickPickSpy = sinon.spy();
        mocker.getMock('logger').api.quickPick = quickPickSpy;

        const extractMethodFactory = subcontainer.build('extractMethodFactory');

        const unusedObject = null;
        const callback = function () { };

        extractMethodFactory(unusedObject, callback)();

        this.verify(prettyJson(quickPickSpy.args));
    });
});