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

describe('Inline Variable', function () {
    var subcontainer;
    var inlineVariableFactory;
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
        subcontainer.register(mocker.getMock('editActionsFactory').mock);

        applySetEditSpy = sinon.spy();

        mocker.getMock('editActionsFactory').api.applyDeleteEdit = function (coords) {
            applySetEditSpy(text, coords);

            return {
                then: function (callback) {
                    callback()
                }
            };
        };

        mocker.getMock('editActionsFactory').api.applySetEdit = function (text, coords) {
            applySetEditSpy(text, coords);

            return {
                then: function (callback) {

                }
            };
        };

        mocker.getMock('logger').api.log = sinon.spy();
        mocker.getMock('logger').api.info = sinon.spy();
    });

    it('should log an error if selection is empty', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('inlineVariableFactory')(null, function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should log an error if multiple selections are made', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

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
        subcontainer.build('inlineVariableFactory')(null, function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should log an error if selection is not inside a function', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
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
                    _line: 2,
                    _character: 18
                }
            }]
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('inlineVariableFactory')(null, function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should log an error if variable is not assigned', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 11,
                    _character: 0
                },
                _end: {
                    _line: 11,
                    _character: 12
                }
            }]
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('inlineVariableFactory')(null, function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should inline variable when selection is okay', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 12,
                    _character: 0
                },
                _end: {
                    _line: 12,
                    _character: 21
                }
            }]
        };

        subcontainer.build('inlineVariableFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});