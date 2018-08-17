'use strict';

const container = require('../container');
const readSource = require('./test-utils/read-source');

const approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('htmlToJs', function () {
    describe('convert', function () {
        let htmlToJs;

        beforeEach(function () {
            htmlToJs = container.build('htmlToJs');
        });

        it('converts html source lines to just JS', function () {
            var sourceTokens = readSource('./test/fixtures/htmlToJs/htmlToJs.html');

            const jsSourceLines = htmlToJs.convert(sourceTokens);

            this.verify(jsSourceLines.join('\n'));
        });
    });
});