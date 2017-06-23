'use strict';

var typescript = require('typescript');

function unboundVarsFactory (){

    function getUnboundVars (sourceLines){
        var source = sourceLines.join('\n');
        var sourceTree = typescript.createSourceFile('foo.js', source, typescript.ScriptTarget.ES5, true);

        sourceTree.statements.forEach(function (nodeObj) {
            console.log('');
            console.log(nodeObj);
        });
    }

    return {
        getUnboundVars: getUnboundVars
    };
}

module.exports = unboundVarsFactory;