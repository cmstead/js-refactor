'use strict';

module.exports = function (motherContainer) {

    function documentData() {
        return {
            _lines: function (index, optionsData) {
                return optionsData && optionsData.lines ? optionsData.lines : []
            },
            _languageId: 'javascript'
        };
    }

    motherContainer.register('documentData', documentData);
};