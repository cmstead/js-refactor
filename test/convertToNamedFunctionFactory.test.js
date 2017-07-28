'use strict';

var container = require('../container');
var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
var approvals = require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Convert to Named Function', function () {
    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;

    beforeEach(function () {
        var testHelper = testHelperFactory();
        
        subcontainer = testHelper.subcontainer;
        applySetEditSpy = testHelper.applySetEditSpy;
        vsCodeProperties = testHelper.vsCodeProperties;
    });

    it('should log an error if selection is empty', function () {
        var sourceTokens = readSource('./test/fixtures/convertToNamedFunction/convertToNamedFunction.js');
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var log = mocker.getMock('logger').api.log;
        subcontainer.build('convertToNamedFunctionFactory')(null, function () { })();

        this.verify(prettyJson(log.args));

    });

    it('should log an error if selection is invalid', function () {
        var sourceTokens = readSource('./test/fixtures/convertToNamedFunction/convertToNamedFunction.js');
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 4,
                    _character: 0
                },
                _end: {
                    _line: 5,
                    _character: 1
                }
            }]
        };


        var log = mocker.getMock('logger').api.log;
        subcontainer.build('convertToNamedFunctionFactory')(null, function () { })();

        this.verify(prettyJson(log.args));

    });

    it('should convert member function to named function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToNamedFunction/convertToNamedFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 3,
                    _character: 0
                },
                _end: {
                    _line: 5,
                    _character: 1
                }
            }]
        };

        subcontainer.build('convertToNamedFunctionFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should convert variable assigned a function to named function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToNamedFunction/convertToNamedFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 8,
                    _character: 0
                },
                _end: {
                    _line: 8,
                    _character: 25
                }
            }]
        };

        subcontainer.build('convertToNamedFunctionFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});