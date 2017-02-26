'use strict';

var editFactory = require('./edit-factory');


function editActionsFactory(
    utilities,
    vsCodeFactory) {

    return function (vsEditor) {
        function applyEdit(edit) {
            return vsCodeFactory.get().workspace.applyEdit(edit);
        }

        function getUri() {
            return utilities.getEditorDocument(vsEditor)._uri;
        }

        function applySetEdit(content, coords) {
            var textEdit = editFactory.buildSetEdit(getUri(), coords, content);

            return applyEdit(textEdit);
        }

        function applySetEdits(edits) {
            var textEdit = editFactory.buildMultipleSetEdits(getUri(), edits);

            return applyEdit(textEdit);
        }

        return {
            applySetEdit: applySetEdit,
            applySetEdits: applySetEdits
        };
    }

}

editActionsFactory['@dependencies'] = [
    'utilities',
    'vsCodeFactory'
]

module.exports = editActionsFactory;
