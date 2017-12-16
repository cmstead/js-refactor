'use strict';

var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Convert to Template', function () {
    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;

    beforeEach(function () {
        var testHelper = testHelperFactory();

        subcontainer = testHelper.subcontainer;
        applySetEditSpy = testHelper.applySetEditSpy;
        vsCodeProperties = testHelper.vsCodeProperties;
    });

    it('should log an error if selection is not string concatenation', function () {
        var sourceTokens = readSource('./test/fixtures/convertToTemplateLiteral/convertToTemplateLiteral.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('convertToTemplateLiteralFactory')(function () { })();

        this.verify(prettyJson(info.args));

    });

    it('should log an error if expression is binary, but not string concatenation', function () {
        var sourceTokens = readSource('./test/fixtures/convertToTemplateLiteral/convertToTemplateLiteral.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 11,
                    _character: 12
                },
                _end: {
                    _line: 11,
                    _character: 27
                }
            }]
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('convertToTemplateLiteralFactory')(function () { })();

        this.verify(prettyJson(info.args));

    });

    it('should convert a concatenated string to a template literal', function () {
        var sourceTokens = readSource('./test/fixtures/convertToTemplateLiteral/convertToTemplateLiteral.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 9,
                    _character: 13
                },
                _end: {
                    _line: 9,
                    _character: 111
                }
            }]
        };

        subcontainer.build('convertToTemplateLiteralFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });
});