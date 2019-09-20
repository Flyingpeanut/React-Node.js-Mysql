import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
      <React.Fragment>
        <h1>About</h1>
        <p>Ted project</p>
      </React.Fragment>
  )
}

const headerStyle = {
  background: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '10px'
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none'
}

export default Footer;
