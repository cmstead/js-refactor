'use strict';

var container = require('../container');
var mocker = require('./mocker');
var sinon = require('sinon');
var assert = require('chai').assert;
var readSource = require('./test-utils/read-source');
var vsCodeFakeFactory = require('./test-utils/vscode-fake-factory');
var testUtils = require('./test-utils/test-utils');
var prettyJson = testUtils.prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
var approvals = require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Convert To Member Function', function () {

    var subcontainer;
    var convertToMemberFunctionFactory;
    var applySetEditSpy;

    beforeEach(function () {
        subcontainer = container.new();

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
    });

    it('should log an error if selection is empty', function () {
        var sourceTokens = readSource('./test/fixtures/convertToMemberFunction/convertToMemberFunction.js');
        var vsCodeFake = vsCodeFakeFactory();
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        vsCodeFake.window.activeTextEditor._documentData._lines = sourceTokens;

        var log = mocker.getMock('logger').api.log;
        subcontainer.build('convertToMemberFunctionFactory')(vsCodeFake.window.activeTextEditor, function () { })();

        this.verify(prettyJson(log.args));
    });


    it('should log an error if selection does not contain a function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToMemberFunction/convertToMemberFunction.js');
        var vsCodeFake = vsCodeFakeFactory();

        vsCodeFake.window.activeTextEditor._documentData._lines = sourceTokens;
        vsCodeFake.window.activeTextEditor._selections = [{
            _start: {
                _line: 4,
                _character: 0
            },
            _end: {
                _line: 5,
                _character: 1
            }
        }];

        var log = mocker.getMock('logger').api.log;
        subcontainer.build('convertToMemberFunctionFactory')(vsCodeFake.window.activeTextEditor, function () { })();

        this.verify(prettyJson(log.args));
    });

    it('should convert function to member function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToMemberFunction/convertToMemberFunction.js');
        var vsCodeFake = vsCodeFakeFactory();

        vsCodeFake.window.activeTextEditor._documentData._lines = sourceTokens;
        vsCodeFake.window.activeTextEditor._selections = [{
            _start: {
                _line: 2,
                _character: 0
            },
            _end: {
                _line: 5,
                _character: 1
            }
        }];

        subcontainer.build('convertToMemberFunctionFactory')(vsCodeFake.window.activeTextEditor, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});