'use strict';

module.exports = function (motherContainer) {
    function activeTextEditor(documentData, editorSelection) {
        return {
            _documentData: documentData,
            _selections: [editorSelection]
        }
    }

    activeTextEditor['@dependencies'] = ['documentData', 'editorSelection'];

    motherContainer.register('activeTextEditor', activeTextEditor);
}


