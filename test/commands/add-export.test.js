'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var mockeryUtils = require('../test-utils/mockery-utils');
var vscodeFakeFactory = require('../test-utils/vscode-fake-factory');

describe('Export Function Command', function () {

    var addExport;
    var vscodeFake;
    var errorMessage;
    var log = sinon.spy();

    beforeEach(function () {
        errorMessage = 'No appropriate named function to export did you select a line containing a function?';
        
        vscodeFake = vscodeFakeFactory();
        vscodeFake.window.showInformationMessage = log;
        log.reset();
        mockeryUtils.setup({ vscode: vscodeFake });
        
        addExport = require('../../modules/commands/add-export');
    });

    afterEach(function () {
        mockeryUtils.teardown();
    });

    it('should log an error when there is no selection', function () {
        addExport(vscodeFake.window.activeTextEditor);

        assert.equal(vscodeFake.window.showInformationMessage.args[0][0], errorMessage);
    });

    it('should log an error when first line of selection contains no function', function () {
        vscodeFake.window.activeTextEditor._documentData._lines = ['foo bar baz'];
        vscodeFake.window.activeTextEditor._selections[0]._end._character = 11;

        addExport(vscodeFake.window.activeTextEditor);

        assert.equal(vscodeFake.window.showInformationMessage.callCount, 1);
    });

});