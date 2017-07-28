'use strict';

var container = require('../container');
var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
var approvals = require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Convert To Member Function', function () {

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
        var sourceTokens = readSource('./test/fixtures/convertToMemberFunction/convertToMemberFunction.js');
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var log = mocker.getMock('logger').api.log;
        subcontainer.build('convertToMemberFunctionFactory')(null, function () { })();

        this.verify(prettyJson(log.args));
    });


    it('should log an error if selection does not contain a function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToMemberFunction/convertToMemberFunction.js');

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
        subcontainer.build('convertToMemberFunctionFactory')(null, function () { })();

        this.verify(prettyJson(log.args));
    });

    it('should convert function to member function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToMemberFunction/convertToMemberFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 2,
                    _character: 0
                },
                _end: {
                    _line: 5,
                    _character: 1
                }
            }]
        };

        subcontainer.build('convertToMemberFunctionFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});