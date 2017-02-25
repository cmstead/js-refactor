'use strict';

function vsCodeFactory() {
    function get() {
        return require('vscode');
    }

    return {
        get: get
    };
}


module.exports = vsCodeFactory;