'use strict';

var j = require('jfp');

function selectionFactory(
    utilities,
    textSelectorFactory) {

    if(typeof utilities === 'undefined') {
        utilities = require('./utilities')();
    }

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