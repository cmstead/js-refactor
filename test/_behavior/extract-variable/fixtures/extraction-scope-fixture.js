const sum = 5 + 6;

function functionDeclaration() {
    console.log('this is a test');
}

const objectLiteral = {
    functionExpression: function() {
        console.log('deeper structure');
    }
}

const arrowFunctionWithBody = () => {
    console.log('Arrow function with body');
}

const arrowFunctionWithoutBody = () => console.log('Arrow function without body');