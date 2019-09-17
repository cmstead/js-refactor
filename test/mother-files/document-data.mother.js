'use strict';

module.exports = function (motherContainer) {

    function documentData() {
        return {
            _lines: function (index, optionsData) {
                return optionsData && optionsData.lines ? optionsData.lines : ['']
            },
            _languageId: 'javascript',
            _uri: {
                fsPath: '/test.js'
            }
        };
    }

    motherContainer.register('documentData', documentData);
};