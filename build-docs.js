'use strict';

const execSync = require('child_process').execSync;

execSync('mochadoc --config .mochadocrc-internal-api');
execSync('mochadoc --config .mochadocrc-refactoring-methods');