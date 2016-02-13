'use strict';

console.log('bar');

(function () {
    
    function myFn (){
        console.log('foo');
        
        return function () {
            return 5 + 6
        };
    }
    
})();