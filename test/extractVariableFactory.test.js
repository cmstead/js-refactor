'use strict';

var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

var sinon = require('sinon');

describe('Extract Variable', function () {
    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;

    beforeEach(function () {
        var testHelper = testHelperFactory();

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
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('extractVariableFactory')(null, function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should log an error if multiple selections are made', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');

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
                    _line: 1,
                    _character: 0
                }
            },
            {
                _start: {
                    _line: 2,
                    _character: 0
                },
                _end: {
                    _line: 3,
                    _character: 0
                }
            }]
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('extractVariableFactory')(null, function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should log an error if selection is not inside a function', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 2,
                    _character: 12
                },
                _end: {
                    _line: 2,
                    _character: 17
                }
            }]
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('extractVariableFactory')(null, function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should extract variable when selection is safe', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 11,
                    _character: 16
                },
                _end: {
                    _line: 11,
                    _character: 19
                }
            }]
        };

        subcontainer.build('extractVariableFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract complex variable', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 11,
                    _character: 21
                },
                _end: {
                    _line: 11,
                    _character: 26
                }
            }]
        };

        subcontainer.build('extractVariableFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract complex variable in arrow function', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 15,
                    _character: 21
                },
                _end: {
                    _line: 15,
                    _character: 26
                }
            }]
        };

        subcontainer.build('extractVariableFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract variable from all use locations', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 19,
                    _character: 21
                },
                _end: {
                    _line: 19,
                    _character: 26
                }
            }]
        };

        subcontainer.build('extractVariableFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});