'use strict';

var selectorFactory = require('./text-selector-factory');

function TextSelection (contentList, selections) {
    this.contentList = contentList;
    this.selections = selections;
}

TextSelection.prototype = {
    
    getSelection: function (index) {
        return selectorFactory(this.selections[index])(this.contentList, this.selection[index]);
    }
    
};

function selectionFactory (vsDocument) {
    return new TextSelection(vsDocument._document._lines, vsDocument._selections);
}

module.exports = {
    selectionFactory: selectionFactory
};