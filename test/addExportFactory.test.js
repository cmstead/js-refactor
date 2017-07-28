'use strict';

var container = require('../container');
var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
var approvals = require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Add Export', function () {

    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;

    beforeEach(function () {
        var testHelper = testHelperFactory();
        
        subcontainer = testHelper.subcontainer;
        applySetEditSpy = testHelper.applySetEditSpy;
        vsCodeProperties = testHelper.vsCodeProperties;
    });

    it('should log an error if function name comes back blank', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-no-exports.js');
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var log = mocker.getMock('logger').api.log;
        subcontainer.build('addExportFactory')(null, function () { })();

        this.verify(prettyJson(log.args));
    });

    it('should add an export to file source when one does not exist', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-no-exports.js');

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

        subcontainer.build('addExportFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should add a single line export to file sourceif other exports are single line', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-line-exports.js');

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

        subcontainer.build('addExportFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should add an export line to existing exported object', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-object-exports.js');

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

        subcontainer.build('addExportFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});


