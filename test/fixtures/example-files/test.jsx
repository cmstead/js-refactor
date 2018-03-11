import { Component } from 'react';

var ipsumText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.';

class TestClass extends Component {
    render() {
        return (
            <div>
                <a className="button">Button</a>
                <div>{ipsumText}</div>
            </div>
        )
    };
}

export default TestClass;