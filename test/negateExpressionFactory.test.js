'use strict';

var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

var sinon = require('sinon');

describe('Negate Condition', function () {

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

                }
            };
        });

        mocker.getMock('editActionsFactory').api.applySetEdit = applySetEditSpy;
    });

    it('should log an error if conditional cannot be found', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should negate a single value', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 3,
                    _character: 8
                },
                _end: {
                    _line: 3,
                    _character: 8
                }
            }]
        };

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate negated value', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 4,
                    _character: 7
                },
                _end: {
                    _line: 4,
                    _character: 11
                }
            }]
        };

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate multiple values', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 5,
                    _character: 7
                },
                _end: {
                    _line: 5,
                    _character: 17
                }
            }]
        };

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate multiple values in parentheses', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 6,
                    _character: 7
                },
                _end: {
                    _line: 6,
                    _character: 19
                }
            }]
        };

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate negated values in parentheses', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 7,
                    _character: 7
                },
                _end: {
                    _line: 7,
                    _character: 28
                }
            }]
        };

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate un-grouped values with first value negated', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 8,
                    _character: 7
                },
                _end: {
                    _line: 8,
                    _character: 18
                }
            }]
        };

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate un-grouped, individually grouped values with first value negated', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 9,
                    _character: 7
                },
                _end: {
                    _line: 9,
                    _character: 22
                }
            }]
        };

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });



});


