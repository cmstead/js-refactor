'use strict';

function myFn (foo, bar) {
    if(foo) { console.log(foo); }
    if(!foo) { console.log(foo); }
    if(foo && bar) { console.log(foo); }
    if((foo && bar)) { console.log(foo); }
    if(!(foo&&bar||!(foo%3))) { console.log(foo); }
    if(!foo && bar) { console.log(foo); }
    if(!(foo) && (bar)) { console.log(foo); }
}