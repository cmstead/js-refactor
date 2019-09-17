'use strict';

var container = require('./testContainer');
const motherContainer = require('./mother-container');
var mocker = require('../mocker');
var sinon = require('sinon');

mocker.registerMock('vscodeFactory');
mocker.registerMock('logger');
mocker.registerMock('editActionsFactory');

function testHelperFactory() {

    const subcontainer = container.new();

    const vsCodeProperties = {
        activeTextEditor: motherContainer.buildData('activeTextEditor')
    };

    var vscodeFactoryFake = mocker.getMock('vscodeFactory').mock(vsCodeProperties);
    subcontainer.override(vscodeFactoryFake);

    let applySetEditSpy = sinon.spy(function (text, coords) {
        return {
            then: function () { return this; },
            catch: function () { return this; }
        };
    });

    mocker.getMock('editActionsFactory').api.applySetEdit = applySetEditSpy;

    subcontainer.register(mocker.getMock('editActionsFactory').mock);

    const loggerMock = mocker.getMock('logger');

    loggerMock.api.log = sinon.spy();
    loggerMock.api.info = sinon.spy();
    loggerMock.api.input = function (astr, callback) {
        callback('foo');
    }

    loggerMock.api.quickPick = function (items, options, callback) {
        callback('var');
    }

    subcontainer.register(loggerMock.mock);

    return {
        applySetEditSpy: applySetEditSpy,
        subcontainer: subcontainer,
        vsCodeProperties: vsCodeProperties
    }

}

module.exports = testHelperFactory;