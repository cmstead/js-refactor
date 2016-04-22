'use strict';

var assert = require('chai').assert;
var mockeryUtils = require('../test-utils/mockery-utils');
var vscodeFakeFactory = require('../test-utils/vscode-fake-factory');

describe('Export Function Command', function () {
    
    var addExport;
    var vscodeFake;
    
    beforeEach(function () {
        vscodeFake = vscodeFakeFactory();
        mockeryUtils.setup({ vscode: vscodeFake });
        addExport = require('../../modules/commands/add-export');
    });
    
    it('should log an error', function () {
        addExport(vscodeFake.window.activeTextEditor);
    });
    
});