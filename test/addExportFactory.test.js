'use strict';

var container = require('../container');
var mocker = require('./mocker');
var sinon = require('sinon');
var assert = require('chai').assert;

var approvalsConfig = require('./test-utils/approvalsConfig');
var approvals = require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Add Export', function () {

    var subcontainer;
    var addExportFactory;

    beforeEach(function () {
        subcontainer = container.new();

        mocker.registerMock('logger');
        mocker.registerMock('selectionFactory');
        mocker.registerMock('functionUtils');
        mocker.registerMock('editActionsFactory');
        mocker.registerMock('utilities');

        subcontainer.register(mocker.getMock('logger').mock);
        subcontainer.register(mocker.getMock('selectionFactory').mock);
        subcontainer.register(mocker.registerMock('functionUtils').mock);
        subcontainer.register(mocker.registerMock('editActionsFactory').mock);
        subcontainer.register(mocker.registerMock('utilities').mock);


        mocker.getMock('selectionFactory').api.getSelection = function () {
            return [];
        }

        mocker.getMock('selectionFactory').api.getSelectionLine = function () {
            return [];
        }

        mocker.getMock('functionUtils').api.getFunctionName = function () {
            return ' ';
        }

        mocker.getMock('logger').api.log = sinon.spy();

        addExportFactory = subcontainer.build('addExportFactory');
    });

    it('should log an error if function name comes back blank', function () {
        var log = mocker.getMock('logger').api.log;
        subcontainer.build('addExportFactory')()();

        assert.equal(log.args[0][0], 'No appropriate named function to export did you select a line containing a function?');
    });

    it('should approve stuff', function () {
        this.verify('test');
    });

});


