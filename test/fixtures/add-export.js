'use strict';

function outerFn () {
    
    function myFn (){
        console.log('foo');
        
        return function () {
            return 5 + 6
        };
    }
    
}