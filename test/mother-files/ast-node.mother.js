'use strict';

module.exports = function (motherContainer) {
    function astNode() {
        return {
            type: 'None',
            loc: {
                start: {
                    line: 1,
                    column: 0
                }, 
                end: {
                    line: 1,
                    column: 0
                }
            }
        };
    }
    
    motherContainer.register('astNode', astNode);
};
