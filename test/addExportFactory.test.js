'use strict';

var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

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

    it('should log an error if chosen expression is not a variable declaration or function', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-no-exports.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('addExportFactory')(null, function () { })();

        this.verify(prettyJson(info.args));
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
                    _character: 10
                },
                _end: {
                    _line: 2,
                    _character: 10
                }
            }]
        };

        subcontainer.build('addExportFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should add a single line export to file source if other exports are single line', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-line-exports.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 2,
                    _character: 10
                },
                _end: {
                    _line: 2,
                    _character: 10
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
                    _character: 10
                },
                _end: {
                    _line: 2,
                    _character: 10
                }
            }]
        };

        subcontainer.build('addExportFactory')(null, function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});


