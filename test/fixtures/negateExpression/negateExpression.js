'use strict';

function myFn (foo, bar) {
    if(foo) {}
    if(!foo) {}
    if(foo && bar) {}
    if((foo && bar)) {}
    if(!foo && bar) {}
    if(!(foo&&bar||!(foo%3))) {}
}