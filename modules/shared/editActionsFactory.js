'use strict';

function editActionsFactory(
    editFactory,
    vscodeFactory) {

    return function (vsEditor) {
        function applyEdit(edit) {
            return vscodeFactory.get().workspace.applyEdit(edit);
        }

        function getEditorDocument(vsEditor) {
            return typeof vsEditor._document === 'object'
                ? vsEditor._document
                : vsEditor._documentData;
        }

        function getUri() {
            return getEditorDocument(vsEditor)._uri;
        }

        function applySetEdit(content, coords) {
            var textEdit = editFactory.buildSetEdit(getUri(), coords, content);

            return applyEdit(textEdit);
        }

        return {
            applySetEdit: applySetEdit
        };
    }

}

module.exports = editActionsFactory;
