'use strict';

var j = require('jfp');
var selectorFactory = require('./text-selector-factory');
var utilities = require('./utilities');

function TextSelection (contentList, selections) {
    this.contentList = contentList;
    this.selections = selections;
}

TextSelection.prototype = {
    
    getSelection: function (index) {
        return selectorFactory(this.selections[index])(this.contentList, this.selections[index]);
    }
    
};

function selectionFactory (vsEditor) {
    return new TextSelection(utilities.getEditorDocument(vsEditor)._lines, vsEditor._selections);
}

module.exports = selectionFactory;