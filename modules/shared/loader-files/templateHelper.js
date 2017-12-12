'use strict';

const fs = require('fs');

function getRawTemplates(templatePath) {
    return fs
        .readdirSync(templatePath)
        .filter((value) => !/^[.]+$/.test(value))
        .map(filename => require(templatePath + filename));
}

const templatePath = __dirname + '/../../templates/';
const rawTemplates = getRawTemplates(templatePath);

function replaceAllKeyInstances(templateStr, key, value) {
    const replacementKey = `{${key}}`;
    let lastResult = null;
    let finalResult = templateStr;

    while(lastResult !== finalResult) {
        lastResult = finalResult;
        finalResult = finalResult.replace(replacementKey, value);
    }

    return finalResult;
}

function buildFromTemplate(templateStrings) {
    var template = templateStrings.join('\n');

    return function (context) {
        return Object.keys(context).reduce(function (result, key) {
            return replaceAllKeyInstances(result, key, context[key]);
        }, template);
    };
}

function insertTemplates(templates, templateSet) {
    return Object
        .keys(templateSet)
        .reduce(function (result, key) {
            result[key] = {
                build: buildFromTemplate(templateSet[key])
            };

            return result;
        }, templates);
}

const templates = rawTemplates.reduce(insertTemplates, {});

function templateHelper() {

    return {
        templates: templates
    }

}

module.exports = templateHelper;