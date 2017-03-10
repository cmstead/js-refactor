'use strict';

function foo (){
    function bar (a, b){
        somethingElse(a + b);
    }

    return bar;
}