'use strict';

var container = require('../container');
var readSource = require('./test-utils/read-source');

describe.skip('Capture unbound variable names', function () {
    var subcontainer;
    var unboundVarsFactory;

    beforeEach(function () {
        subcontainer = container.new();
        unboundVarsFactory = subcontainer.build('unboundVarsFactory');
    });
    
    it('should run, this is an exploration', function () {
        var source = readSource('./test/fixtures/unboundVars/unboundVars.js');
        unboundVarsFactory.getUnboundVars(source);
    });

});