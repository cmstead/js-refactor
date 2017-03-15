'use strict';

var j = require('jfp');

function shiftParamsLeftFactory(shiftParamsFactory) {

    return j.partial(shiftParamsFactory, 'left');
    
}

module.exports = shiftParamsLeftFactory;