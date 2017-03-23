'use strict';

function negateExpressionAction (){

    function isNegated (expression){
        return expression[0] === '!'
    }

    function isMultiValue (expression) {
        return expression.match(/\s/g) !== null;
    }

    function groupExpression(expression) {
        return '(' + expression + ')';
    }

    function negateExpression (expression){
        var negated = isNegated(expression);
        var multivalue = isMultiValue(expression);

        var result = !negated && multivalue ? groupExpression(expression) : expression;

        return negated ? result.substr(1) : '!' + result;
    }

    return {
        negateExpression: negateExpression
    };
}

module.exports = negateExpressionAction;