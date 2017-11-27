'use strict';

module.exports = function (motherContainer) {
    function ast() {
        const astProgram = motherContainer.buildData('astNode');
        astProgram.type = 'Program';

        return astProgram;
    }

    motherContainer.register('ast', ast);
}