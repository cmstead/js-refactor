'use strict';

let mocker = require('./mocker');

let testHelperFactory = require('./test-utils/testHelperFactory');

let readSource = require('./test-utils/read-source');
let prettyJson = require('./test-utils/test-utils').prettyJson;

let approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

let sinon = require('sinon');

describe('Lift and Name Function', function () {

    let applySetEditSpy;
    let subcontainer;
    let vsCodeProperties;
    let setupOptions;
    let quickPickSpy;

    beforeEach(function () {
        const testHelper = testHelperFactory();
        setupOptions = {
            selectedScopeIndex: 0
        };

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

        quickPickSpy = sinon.spy(function (selectionItems, options, callback) {
            callback(selectionItems[setupOptions.selectedScopeIndex]);
        });

        mocker.getMock('logger').api.quickPick = quickPickSpy;
        mocker.getMock('logger').api.input = (options, callback) => callback('aNewFunction');
    });

    it('should log an error when no valid function expression can be found', function () {
        var sourceTokens = readSource('./test/fixtures/liftAndNameFunction/liftAndNameFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('liftAndNameFunctionFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should lift and name a function expression', function () {
        var sourceTokens = readSource('./test/fixtures/liftAndNameFunction/liftAndNameFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 6,
                    _character: 21
                },
                _end: {
                    _line: 6,
                    _character: 21
                }
            }]
        };

        subcontainer.build('liftAndNameFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should log an error when a named function is selected', function () {
        var sourceTokens = readSource('./test/fixtures/liftAndNameFunction/liftAndNameFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 2,
                    _character: 18
                },
                _end: {
                    _line: 2,
                    _character: 18
                }
            }]
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('liftAndNameFunctionFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

});