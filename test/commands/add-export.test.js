'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var mockeryUtils = require('../test-utils/mockery-utils');
var vscodeFakeFactory = require('../test-utils/vscode-fake-factory');
var editActions = require('../../modules/shared/edit-actions');

describe('Export Function Command', function () {

    var addExport;
    var applySetEdit;
    var vscodeFake;
    var errorMessage;
    var log = sinon.spy();

    beforeEach(function () {
        errorMessage = 'No appropriate named function to export did you select a line containing a function?';
        
        vscodeFake = vscodeFakeFactory();
        vscodeFake.window.showInformationMessage = log;
        
        applySetEdit = editActions.applySetEdit;
        
        log.reset();
        
        mockeryUtils.setup({
            'edit-actions': editActions,
            vscode: vscodeFake
        });
        
        addExport = require('../../modules/commands/add-export');
    });

    afterEach(function () {
        editActions.applySetEdit = applySetEdit;
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
    
    it('should add an export to the bottom of the text document with a valid function', function () {
        
        vscodeFake.window.activeTextEditor._documentData._lines = ['function myFn () {'];
        vscodeFake.window.activeTextEditor._selections[0]._end._character = 18;
        
        editActions.applySetEdit = sinon.spy();
        
        addExport(vscodeFake.window.activeTextEditor);
        
        var exportValue = editActions.applySetEdit.args[0][1];
        var exportLocation = editActions.applySetEdit.args[0][2];
        
        assert.equal(exportValue, '\nmodule.exports = {\n\tmyFn: myFn\n}');
        assert.equal(JSON.stringify(exportLocation), '{"start":[1,19],"end":[1,19]}');
    });

    it('should add an export line to an existing export object', function () {
        
        vscodeFake.window.activeTextEditor._documentData._lines = [
            'function myFn () {',
            '}',
            'module.exports = {',
            '}'
        ];
        vscodeFake.window.activeTextEditor._selections[0]._end._character = 18;
        
        editActions.applySetEdit = sinon.spy();
        
        addExport(vscodeFake.window.activeTextEditor);
        
        var exportValue = editActions.applySetEdit.args[0][1];
        var exportLocation = editActions.applySetEdit.args[0][2];
        
        assert.equal(exportValue, '\n\tmyFn: myFn,');
        assert.equal(JSON.stringify(exportLocation), '{"start":[2,19],"end":[2,19]}');
    });

    it('should add a stand alone export line if lines already exist', function () {
        
        vscodeFake.window.activeTextEditor._documentData._lines = [
            'function myFn () {',
            '}',
            'module.exports.foo = foo;'
        ];
        vscodeFake.window.activeTextEditor._selections[0]._end._character = 18;
        
        editActions.applySetEdit = sinon.spy();
        
        addExport(vscodeFake.window.activeTextEditor);
        
        var exportValue = editActions.applySetEdit.args[0][1];
        var exportLocation = editActions.applySetEdit.args[0][2];
        
        assert.equal(exportValue, '\nmodule.exports.myFn = myFn');
        assert.equal(JSON.stringify(exportLocation), '{"start":[3,26],"end":[3,26]}');
    });

    it('should add an export line to an existing object if objects and lines both exist', function () {
        
        vscodeFake.window.activeTextEditor._documentData._lines = [
            'function myFn () {',
            '}',
            'module.exports = {',
            '}',
            'module.exports.foo = foo;'
        ];
        vscodeFake.window.activeTextEditor._selections[0]._end._character = 18;
        
        editActions.applySetEdit = sinon.spy();
        
        addExport(vscodeFake.window.activeTextEditor);
        
        var exportValue = editActions.applySetEdit.args[0][1];
        var exportLocation = editActions.applySetEdit.args[0][2];
        
        assert.equal(exportValue, '\n\tmyFn: myFn,');
        assert.equal(JSON.stringify(exportLocation), '{"start":[2,19],"end":[2,19]}');
    });

});