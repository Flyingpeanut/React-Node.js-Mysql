import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";


function handleLogoutClick(props) {
  axios
    .delete("http://localhost:9001/auth/logout", { withCredentials: true })
    .then(response => {
        props.handleLogout();
        props.history.push("/");
    })
    .catch(error => {
      console.log("logout error", error);
    });

}

function Header(props) {

    const logged = props.loggedInStatus
    const admin = false
  return (
    <header style={headerStyle}>
      <h1> <Link style={linkStyle} to="/">Bid World</Link></h1>
       <div style = {placedRight}>
      { logged &&
          <React.Fragment >
            {<Link style={linkStyle} to="/profile">Profile</Link>}
            {<Link style={linkStyle} to="/protected">Admininstration</Link>}
            <Link style = {linkStyle} to="/" onClick={() => {handleLogoutClick(props)}}>Log Out</Link>

          </React.Fragment>
        }
         {!logged &&
            <React.Fragment >

                    <Link style={linkStyle} to="/auth/login">Sign In</Link>
                    <Link style={linkStyle} to="/auth/register">Sign Up</Link>

            </React.Fragment>
        }
        </div>
    </header>
  )
}

const placedRight = {
  background: '#333',
  color: '#fff',
  margin: '0 70%',
  width: '20%',
}

const headerStyle = {
  background: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '6px'
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  margin: '8px',
}

export default Header;
