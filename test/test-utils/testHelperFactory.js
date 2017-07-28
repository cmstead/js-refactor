'use strict';

var container = require('../../container');
var mocker = require('../mocker');
var sinon = require('sinon');

mocker.registerMock('vsCodeFactory');
mocker.registerMock('logger');
mocker.registerMock('editActionsFactory');

function testHelperFactory() {

    const subcontainer = container.new();

    const vsCodeProperties = {};
    var vsCodeFactoryFake = mocker.getMock('vsCodeFactory').mock(vsCodeProperties);
    subcontainer.register(vsCodeFactoryFake);

    let applySetEditSpy = sinon.spy(function (text, coords) {
        return {
            then: function () { }
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