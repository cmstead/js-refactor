'use strict';

var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Convert to Arrow Function', function () {
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
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var log = mocker.getMock('logger').api.log;
        subcontainer.build('convertToArrowFunctionFactory')(null, function () { })();

        this.verify(prettyJson(log.args));

    });

    it('should log an error if selection is invalid', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');

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
        subcontainer.build('convertToArrowFunctionFactory')(null, function () { })();

        this.verify(prettyJson(log.args));

    });

    it('should convert function to arrow function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 2,
                    _character: 25
                },
                _end: {
                    _line: 4,
                    _character: 1
                }
            }]
        };

        subcontainer.build('convertToArrowFunctionFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});