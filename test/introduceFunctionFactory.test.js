'use strict';

let mocker = require('./mocker');

let testHelperFactory = require('./test-utils/testHelperFactory');

let readSource = require('./test-utils/read-source');
let prettyJson = require('./test-utils/test-utils').prettyJson;

let approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

let sinon = require('sinon');

describe('Introduce Function', function () {

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

    it('should log an error when no valid identifier can be found', function () {
        var sourceTokens = readSource('./test/fixtures/introduceFunction/introduceFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('introduceFunctionFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should create a function when an appropriate object property is found', function () {
        var sourceTokens = readSource('./test/fixtures/introduceFunction/introduceFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 11,
                    _character: 23
                },
                _end: {
                    _line: 11,
                    _character: 23
                }
            }]
        };

        subcontainer.build('introduceFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should create a function when an appropriate function call is found', function () {
        var sourceTokens = readSource('./test/fixtures/introduceFunction/introduceFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 8,
                    _character: 25
                },
                _end: {
                    _line: 8,
                    _character: 25
                }
            }]
        };

        subcontainer.build('introduceFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should create a function when an appropriate variable declaration is found', function () {
        var sourceTokens = readSource('./test/fixtures/introduceFunction/introduceFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 4,
                    _character: 41
                },
                _end: {
                    _line: 4,
                    _character: 41
                }
            }]
        };

        subcontainer.build('introduceFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });
});