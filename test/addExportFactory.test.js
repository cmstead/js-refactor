'use strict';

var container = require('../container');
var mocker = require('./mocker');
var sinon = require('sinon');
var assert = require('chai').assert;
var readSource = require('./test-utils/read-source');
var vsCodeFakeFactory = require('./test-utils/vscode-fake-factory');

var approvalsConfig = require('./test-utils/approvalsConfig');
var approvals = require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Add Export', function () {

    var subcontainer;
    var addExportFactory;
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
                then: function(){}
            };
        };

        mocker.getMock('logger').api.log = sinon.spy();

        addExportFactory = subcontainer.build('addExportFactory');
    });

    it('should log an error if function name comes back blank', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-no-exports.js');
        var vsCodeFake = vsCodeFakeFactory();
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        vsCodeFake.window.activeTextEditor._documentData._lines = sourceTokens;

        var log = mocker.getMock('logger').api.log;
        subcontainer.build('addExportFactory')(vsCodeFake.window.activeTextEditor, function(){})();

        assert.equal(log.args[0][0], 'No appropriate named function to export did you select a line containing a function?');
    });

    it('should add an export to file source when one does not exist', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-no-exports.js');
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

        subcontainer.build('addExportFactory')(vsCodeFake.window.activeTextEditor, function () { })();

        this.verify(JSON.stringify(applySetEditSpy.args, null, 4));
    });

    it('should add a single line export to file sourceif other exports are single line', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-line-exports.js');
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

        subcontainer.build('addExportFactory')(vsCodeFake.window.activeTextEditor, function () { })();

        this.verify(JSON.stringify(applySetEditSpy.args, null, 4));
    });

    it('should add an export line to existing exported object', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-object-exports.js');
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

        subcontainer.build('addExportFactory')(vsCodeFake.window.activeTextEditor, function () { })();

        this.verify(JSON.stringify(applySetEditSpy.args, null, 4));
    });

});


