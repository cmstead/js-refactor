'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var mockeryUtils = require('../test-utils/mockery-utils');
var vscodeFakeFactory = require('../test-utils/vscode-fake-factory');
var editActions = require('../../modules/shared/edit-actions');

describe('convert to member function', function () {
    
    var applySetEdit;
    var vscodeFake;
    var convertToMemberFunction;
    var log = sinon.spy();
    
    beforeEach(function () {
        
        vscodeFake = vscodeFakeFactory();
        
        vscodeFake.window.showInformationMessage = log;
        
        applySetEdit = editActions.applySetEdit;
        
        log.reset();
        
        mockeryUtils.setup({
            vscode: vscodeFake
        });
        
        convertToMemberFunction = require('../../modules/commands/convert-to-member-function');
    });
    
    afterEach(function () {
        editActions.applySetEdit = applySetEdit;
        mockeryUtils.teardown();
    });
    
    it('should log an error if nothing is selected', function () {
        var message = 'Cannot perform member function conversion on an empty selection.';
        convertToMemberFunction(vscodeFake.window.activeTextEditor);
        assert.equal(log.args[0][0], message);
    });
    
    it('should log an error if selectiomn does not contain a function', function () {
        var message = 'No appropriate named function to convert did you select a line containing a function?';
        
        vscodeFake.window.activeTextEditor._documentData._lines['foo bar baz'];
        vscodeFake.window.activeTextEditor._selections[0]._end._character = 11;
        
        convertToMemberFunction(vscodeFake.window.activeTextEditor);
        assert.equal(log.args[0][0], message);
    });
    
    it('should log an error if selectiomn does not contain a named function', function () {
        var message = 'No appropriate named function to convert did you select a line containing a function?';
        
        vscodeFake.window.activeTextEditor._documentData._lines['function () {'];
        vscodeFake.window.activeTextEditor._selections[0]._end._character = 13;
        
        convertToMemberFunction(vscodeFake.window.activeTextEditor);
        assert.equal(log.args[0][0], message);
    });
    
});