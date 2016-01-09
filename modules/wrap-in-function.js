'use strict';

var logger = require('./logger-factory')(),
    editFactory = require('./edit-factory'),
    actions = require('./common-actions'),
    selectionFactory = require('./selection-factory'),
    
    functionTemplate = 'function {name}(){\n';


function indent (value) {
    return value.trim() === '' ? value : '\t' + value;
}

function wrapCode (name, lines) {
    return functionTemplate.replace('{name}', name) 
            + lines.map(indent).join('\n')
            + '}\n';
}

function wrapInFunction (vsEditor) {
    var selection = selectionFactory(vsEditor).getSelection(0);

    if (selection === null) {
        logger.error('Cannot wrap empty selection');
    } else {
        actions.applyEdit(editFactory.buildSetEdit(vsEditor._document._uri,
                                                   actions.buildLineCoords(vsEditor, 0), 
                                                   wrapCode('', selection)));
    }
}

module.exports = wrapInFunction;