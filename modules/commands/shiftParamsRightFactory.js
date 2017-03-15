'use strict';

var j = require('jfp');

function shiftParamsRightFactory(shiftParamsFactory) {

    return j.partial(shiftParamsFactory, 'right');
    
}

module.exports = shiftParamsRightFactory;