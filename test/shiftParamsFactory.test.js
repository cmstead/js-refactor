'use strict';

var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

var sinon = require('sinon');

describe('Shift Params', function () {
    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;
    var quickPickSpy;
    var quickPickOptions;

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

        quickPickOptions = {
            itemIndices: [0, 0]
        };

        quickPickSpy = sinon.spy(function (selectionItems, options, callback){
            const selectedIndex = quickPickOptions.itemIndices.shift();

            callback(selectionItems[selectedIndex]);
        });

        mocker.getMock('logger').api.quickPick = quickPickSpy;
    });

    it('should log an error if selection is not within a function', function () {
        var sourceTokens = readSource('./test/fixtures/shiftParams/shiftParams.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('shiftParamsFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should rotate params one to the left', function () {
        var sourceTokens = readSource('./test/fixtures/shiftParams/shiftParams.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 2,
                    _character: 17
                },
                _end: {
                    _line: 2,
                    _character: 17
                }
            }]
        };

        subcontainer.build('shiftParamsFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should rotate params one to the right', function () {
        quickPickOptions.itemIndices = [1, 0];
        var sourceTokens = readSource('./test/fixtures/shiftParams/shiftParams.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 2,
                    _character: 17
                },
                _end: {
                    _line: 2,
                    _character: 17
                }
            }]
        };

        subcontainer.build('shiftParamsFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should rotate params two to the left', function () {
        quickPickOptions.itemIndices = [0, 1];
        var sourceTokens = readSource('./test/fixtures/shiftParams/shiftParams.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 2,
                    _character: 17
                },
                _end: {
                    _line: 2,
                    _character: 17
                }
            }]
        };

        subcontainer.build('shiftParamsFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});