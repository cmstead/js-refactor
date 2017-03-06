'use strict';

function editActionsFactory (api) {
    return function editActionsFactory() {
        return function (){
            return api;
        };
    }
}

module.exports = editActionsFactory;