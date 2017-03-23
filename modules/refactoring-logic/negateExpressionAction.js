'use strict';

function negateExpressionAction (){

    function isNegated (expression){
        return expression[0] === '!'
    }

    function isMultiValue (expression) {
        return expression.match(/\s/g) !== null;
    }

    function isGroupedExpression (expression) {
        // Yes, that's a lot of parentheses
        var groupedPattern = 
        '^\\!?\\(' + 
        '(' +
        '(\\(.+\\))+' +
        '|' +
        '([^\(\)])+' +
        ')+' +
        '\\)$';
        return expression.match(new RegExp(groupedPattern)) !== null;
    }

    function groupExpression(expression) {
        return '(' + expression + ')';
    }

    function negate (expression){
        var negated = isNegated(expression);
        return negated ? expression.substr(1) : '!' + expression;
    }

    function negateExpression (expression){
        var multivalue = isMultiValue(expression);
        var grouped = isGroupedExpression(expression);

        var result = multivalue && !grouped ? groupExpression(expression) : expression;

        return negate(result);
    }

    return {
        negateExpression: negateExpression
    };
}

module.exports = negateExpressionAction;