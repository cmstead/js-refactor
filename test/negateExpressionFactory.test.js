'use strict';

var container = require('../container');
var mocker = require('./mocker');
var sinon = require('sinon');
var assert = require('chai').assert;
var readSource = require('./test-utils/read-source');
var testUtils = require('./test-utils/test-utils');
var prettyJson = testUtils.prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
var approvals = require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Negate Condition', function () {

    var subcontainer;
    var negateExpressionFactory;
    var applySetEditSpy;
    var vsCodeProperties;

    beforeEach(function () {
        subcontainer = container.new();

        vsCodeProperties = {};
        mocker.registerMock('vsCodeFactory');

        var vsCodeFactoryFake = mocker.getMock('vsCodeFactory').mock(vsCodeProperties);

        subcontainer.register(vsCodeFactoryFake);

        mocker.registerMock('logger');
        mocker.registerMock('editActionsFactory');

        subcontainer.register(mocker.getMock('logger').mock);
        subcontainer.register(mocker.registerMock('editActionsFactory').mock);

        applySetEditSpy = sinon.spy();
        mocker.getMock('editActionsFactory').api.applySetEdit = function (text, coords) {
            applySetEditSpy(text, coords);

            return {
                then: function () { }
            };
        };

        mocker.getMock('logger').api.log = sinon.spy();

        negateExpressionFactory = subcontainer.build('negateExpressionFactory');
    });

    it('should log an error if selection is empty', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var log = mocker.getMock('logger').api.log;
        subcontainer.build('negateExpressionFactory')(null, function () { })();

        this.verify(prettyJson(log.args));
    });

    it('should log an error if selection is multi-line', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

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

        var log = mocker.getMock('logger').api.log;
        subcontainer.build('negateExpressionFactory')(null, function () { })();

        this.verify(prettyJson(log.args));
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
                    _character: 7
                },
                _end: {
                    _line: 3,
                    _character: 10
                }
            }]
        };

        subcontainer.build('negateExpressionFactory')(null, function () { })();

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

        subcontainer.build('negateExpressionFactory')(null, function () { })();

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

        subcontainer.build('negateExpressionFactory')(null, function () { })();

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

        subcontainer.build('negateExpressionFactory')(null, function () { })();

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

        subcontainer.build('negateExpressionFactory')(null, function () { })();

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

        subcontainer.build('negateExpressionFactory')(null, function () { })();

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

        subcontainer.build('negateExpressionFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });



});


