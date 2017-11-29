'use strict';

module.exports = function (motherContainer) {
    function activeTextEditor(documentData) {
        return {
            _documentData: documentData
        }
    }

    activeTextEditor['@dependencies'] = ['documentData'];

    motherContainer.register('activeTextEditor', activeTextEditor);
}


