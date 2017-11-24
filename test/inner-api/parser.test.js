'use strict';

const assert = require('chai').assert;
const container = require('../../container');
const testUtils = require('../test-utils/test-utils');

require('../test-utils/approvalsConfig');

const jsxSource = `var ipsumText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.';

ReactDOM.render(
  <div>
    <a className="button">Button</a>
    <div>{ipsumText}</div>
  </div>,
  document.getElementById('impl')
);`;

describe('parser', function() {
    
    

});