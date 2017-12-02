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

function templateHelper() {

    function buildFromTemplate(templateStrings) {
        var template = templateStrings.join('\n');

        return function (context) {
            return Object.keys(context).reduce(function (result, key) {
                const replacementKey = `{${key}}`;
                return result.replace(replacementKey, context[key]);
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
            }, {});
    }

    const templates = rawTemplates.reduce(insertTemplates, {});

    return {
        templates: templates
    }

}

module.exports = templateHelper;