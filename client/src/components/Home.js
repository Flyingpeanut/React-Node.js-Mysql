import React, { Component } from "react";
import { Link } from 'react-router-dom';


export default class Home extends Component {


  render() {
    return (
      <div>
         <h1>Bid for your dreams</h1>
        <p>Hello world</p>
        <Link  to="/search">Search for bids here</Link>

      </div>
    );
  }
}
