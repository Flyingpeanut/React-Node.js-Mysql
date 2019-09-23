import React from 'react';
import axios from 'axios';

/*to be implemented*/

export default class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { on: false };
  }

  toggle = () => {
    this.setState({
         on: !this.state.on
     });
  }

  render() {
    let index = this.props.key;
    let item = this.props.item;
    return (
        <div>
        { this.state.on && (
                <h1>Hello World</h1>
        )}
            <button onClick={this.toggle}> Show/Hide </button>
        </div>
    );
  }
}
