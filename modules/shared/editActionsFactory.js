'use strict';

function editActionsFactory(
    editFactory,
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

        function applyDeleteEdit(coords) {
            var textEdit = editFactory.buildDeleteEdit(getUri(), coords, content);

            return applyEdit(textEdit);
        }

        return {
            applyDeleteEdit: applyDeleteEdit,
            applySetEdit: applySetEdit
        };
    }

}

module.exports = editActionsFactory;
