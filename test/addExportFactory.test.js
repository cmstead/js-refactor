'use strict';
var container = require('../container');

container.register('logger', function () {
    function log() { };

    return {
        log: log
    };
});

container.register('selectionFactory', function () {
    function selectionFactory() {
        return {}
    };


    return selectionFactory;
});

container.register('functionUtils', function () {
    function getFunctionName() { };

    return {
        getFunctionName: getFunctionName
    };
});

container.register('editActionsFactory', function () {
    function editActionsFactory() {
        return {};
    };

    return editActionsFactory;
});

container.register('utilities', function () {
    function utilities() {
        return {};
    };

    return {};
});

container.register('templateUtils', function () {
    function utilities() {
        return {};
    };

    return {};
});


