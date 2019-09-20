import React, { Component } from "react";

import Register from "./Register";
import LoginForm from "./LoginForm";

import {
		Route,
	} from 'react-router-dom';

export default class Auth extends Component {
  constructor(props) {
    super(props);

        this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
  }

  handleSuccessfulAuth(data) {
    //  console.log(data);
    this.props.handleLogin(data);
    this.props.history.push("/dashboard");
  }



  render() {
    return (
      <div>


        <Route

         path={"/auth/register"}
         render={props => (
           <Register
             {...props}
            handleSuccessfulAuth={this.handleSuccessfulAuth}
           />
         )}
       />
       <Route

         path={"/auth/login"}
         render={props => (
           <LoginForm
             {...props}
             handleSuccessfulAuth={this.handleSuccessfulAuth}
           />
         )}
       />

      </div>
    );
  }
}
