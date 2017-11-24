'use strict';

const fs = require('fs');
const container = require('./container');

const parser = container.build('parser');
const scopePathHelper = container.build('scopePathHelper');
const testSource = fs.readFileSync('./test/fixtures/unboundVars/unboundVars.js', 'utf8');
const testSourceLines = testSource.split('\n');

const ast = parser.parseSourceLines(testSourceLines);

const coords = {
    start: [8, 24],
    end: [8, 27]
};

const scopePath = scopePathHelper.buildScopePath(coords, ast);

fs.writeFileSync('proof-of-concept.json', JSON.stringify(scopePath, null, 4));

