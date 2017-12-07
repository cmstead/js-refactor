'use strict';

var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

var sinon = require('sinon');

describe('Inline Variable', function () {
    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;

    beforeEach(function () {
        var testHelper = testHelperFactory();

        subcontainer = testHelper.subcontainer;
        applySetEditSpy = testHelper.applySetEditSpy;
        vsCodeProperties = testHelper.vsCodeProperties;

        applySetEditSpy = sinon.spy(function (text, coords) {
            return {
                then: function (callback) {
                    callback();
                }
            };
        });

        mocker.getMock('editActionsFactory').api.applySetEdit = applySetEditSpy;
    });

    it('should log an error if selection is not an identifier or variable declaration', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens,
                _selections: [
                    {
                        _start: {
                            _line: 4,
                            _column: 10
                        },
                        _end: {
                            _line: 4,
                            _column: 10
                        }
                    }
                ]
            }
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('inlineVariableFactory')(null, function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should log an error if variable is not assigned', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 11,
                    _character: 9
                },
                _end: {
                    _line: 11,
                    _character: 9
                }
            }]
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('inlineVariableFactory')(null, function () { })();

        this.verify(prettyJson(info.args));
    });

    it.only('should inline variable when selection is okay', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 12,
                    _character: 10
                },
                _end: {
                    _line: 12,
                    _character: 10
                }
            }]
        };

        subcontainer.build('inlineVariableFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should inline from selected non-assignment identifier', function() {
        // This test needs to be written to handle other valid variable type case
    });

    it.skip('should inline variable from comma-separated variable list', function() {
        // I don't even know what this is going to look like yet.
    });

});