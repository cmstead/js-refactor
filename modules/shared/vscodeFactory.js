'use strict';

function vscodeFactory() {
    function get() {
        return require('vscode');
    }

    return {
        get: get
    };
}


module.exports = vscodeFactory;