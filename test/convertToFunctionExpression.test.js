'use strict';

var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Convert to Function Expression', function () {
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
        var sourceTokens = readSource('./test/fixtures/convertToFunctionExpression/convertToFunctionExpression.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('convertToFunctionExpressionFactory')(function () { })();

        this.verify(prettyJson(info.args));

    });

    it('should log an error if selection is invalid', function () {
        var sourceTokens = readSource('./test/fixtures/convertToFunctionExpression/convertToFunctionExpression.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 0,
                    _character: 0
                },
                _end: {
                    _line: 0,
                    _character: 13
                }
            }]
        };


        var info = mocker.getMock('logger').api.info;
        subcontainer.build('convertToFunctionExpressionFactory')(function () { })();

        this.verify(prettyJson(info.args));

    });

    it('should convert an arrow function with no arguments to a function expression', function () {
        var sourceTokens = readSource('./test/fixtures/convertToFunctionExpression/convertToFunctionExpression.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 2,
                    _character: 22
                },
                _end: {
                    _line: 2,
                    _character: 22
                }
            }]
        };

        subcontainer.build('convertToFunctionExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should convert arrow function declaration with arguments to anonymous function expression', function () {
        var sourceTokens = readSource('./test/fixtures/convertToFunctionExpression/convertToFunctionExpression.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 4,
                    _character: 27
                },
                _end: {
                    _line: 4,
                    _character: 27
                }
            }]
        };

        subcontainer.build('convertToFunctionExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('converts multiline arrow function to function expression', function () {
        var sourceTokens = readSource('./test/fixtures/convertToFunctionExpression/convertToFunctionExpression.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 6,
                    _character: 34
                },
                _end: {
                    _line: 6,
                    _character: 34
                }
            }]
        };

        subcontainer.build('convertToFunctionExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});