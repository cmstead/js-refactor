'use strict';

function editApiFactory(vscodeFactory) {

    return function () {

        const vscode = vscodeFactory.get();

        function positionFactory(location) {
            return new vscode.Position(location[0], location[1]);
        }

        function rangeFactory(start, end) {
            var startPosition = positionFactory(start);
            var endPosition = positionFactory(end);

            return new vscode.Range(startPosition, endPosition);
        }

        function textEditFactory(coords, content) {
            var range = rangeFactory(coords.start, coords.end);
            return new vscode.TextEdit(range, content);
        }

        function workspaceEditFactory() {
            return new vscode.WorkspaceEdit();
        }

        return {
            workspaceEditFactory: workspaceEditFactory,
            textEditFactory: textEditFactory
        };

    }
}

module.exports = editApiFactory;