'use strict';

var assert = require('chai').assert;
var mockery = require('mockery');
var vscodeFake = require('./test-utils/vscode-fake');
var vscodeFactory = require('../modules/shared/vscodeFactory');
var testUtils = require('./test-utils/test-utils');

require('./test-utils/approvals')();

describe('register actions', function() {

    var extension;
    var commandRegister;
    var commandKeys;

    beforeEach(function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });

        mockery.registerMock('vscode', vscodeFake);
        extension = require('../extension');

        extension.activate({ subscriptions: [] });
    });

    afterEach(function() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should have all known actions registered', function() {
        var registeredCommands = vscodeFake.commands.getRegisteredCommandList();
        var approvalResult = testUtils.objectFunctionsToSource(registeredCommands);
        
        this.verify(testUtils.prettyJson(approvalResult));
    });

});