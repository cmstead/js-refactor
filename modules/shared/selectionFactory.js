'use strict';

function selectionFactory(
    utilities,
    textSelectorFactory) {

    return function (vsEditor) {
        var contentList = utilities.getEditorDocument(vsEditor)._lines;
        var selections = vsEditor._selections;

        function getSelectionLine(index) {
            return contentList[selections[index]._start._line];
        }

        function getSelection(index) {
            return textSelectorFactory(selections[index])(contentList, selections[index]);
        }

        return {
            getSelectionLine: getSelectionLine,
            getSelection: getSelection
        };
    }

}

module.exports = selectionFactory;