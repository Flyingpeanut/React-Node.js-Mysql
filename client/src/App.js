import React, { Component } from 'react';
import { BrowserRouter as Router,
		Route,
		Switch,
		withRouter
	} from 'react-router-dom';
import Header from './components/layout/Header';
import Auth from './components/login/Auth';
import Home from './components/Home';
import Search from "./components/Search";
import AdminPage from "./components/protectedRoute/AdminPage"
import ItemPage from "./components/ItemPage"
import Profile from "./components/profile/Profile"
import {PrivateRoute} from "./components/protectedRoute/PrivateRoute"
import {NotAuthenticatedRoute} from "./components/protectedRoute/NotAuthenticatedRoute"

//import uuid from 'uuid';
import axios from 'axios';

import './App.css';


class App extends Component {
	constructor() {
      super();

      this.state = {
        loggedInStatus: false,
		user:	{
				id:'',
				username:'',
				admin:'',
				aproved:'',
				have_messg:'',
			}

      };

      this.handleLogin = this.handleLogin.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
    }

    checkLoginStatus() {
      axios
        .get("http://localhost:9001/auth/login", { withCredentials: true })
        .then(response => {
		  if (
            response.data.logged_in &&
            this.state.loggedInStatus === false
          ) {
            this.setState({
              	loggedInStatus: true,
			  	user:response.data.user
            });
          } else if (
            !response.data.logged_in &
            (this.state.loggedInStatus === true)
          ) {
            this.setState({
              	loggedInStatus: false,
			  	user:response.data.user
            });
			
          }
        })
        .catch(error => {
          console.log("check login error", error);
        });
    }

    componentDidMount() {
      this.checkLoginStatus();

    }

    handleLogout() {
		console.log('logging out');

      this.setState({
        loggedInStatus: false,
        user: {}
      });
	  //this.props.history.push("/");
    }

    handleLogin(data) {

		if (data.logged_in) {
			this.setState({
			  loggedInStatus: true,
			  user: data.user
			});
		}

    }

    	render() {
    		return (
    			<Router>
    				<div className='App'>
    					<div className='container'>
							 <Route
							   	path='/'
								render={(props) => (
									<Header
										{... props}
									 	handleLogout={this.handleLogout}
										loggedInStatus = {this.state.loggedInStatus}
										admin ={this.state.user.admin}
									/>
								)}
							 />
							 <Switch>
							 <Route
							   exact path='/'
							   render={(props) => (
									 <Home {... props}
									  handleLogin={this.handleLogin}
									  loggedInStatus = {this.state.loggedInStatus}/>
								 )}
							 />
							  <Route
							    exact path='/search'
								render={(props) => (
									  <Search {... props}
									   handleLogin={this.handleLogin}
									   loggedInStatus = {this.state.loggedInStatus}/>
								  )}
							  />

							  <Route exact path="/item/:itemId"
							  		render={(props) => (
  									  <ItemPage {... props}
  									   loggedInStatus = {this.state.loggedInStatus}/>
  								  )} />

							  <NotAuthenticatedRoute
							    path='/auth'
							  	component={Auth}
								handleLogin={this.handleLogin}
								loggedInStatus = {this.state.loggedInStatus}
									 />

 							 />
							 <PrivateRoute
							   path='/protected'
							   component = {AdminPage}
							   user = {this.state.user}
							   loggedInStatus = {this.state.loggedInStatus}
							  />
							  <PrivateRoute
								  path='/profile'
								  component = {Profile}
								  user = {this.state.user}
								  loggedInStatus = {this.state.loggedInStatus}
							 />
							<Route
							  path='*'
							  component = {() => "404 NOT FOUND"}
						   />

						  </Switch>
    					</div>
    				</div>
    			</Router>
    		);
    	}
    }
	withRouter(App)
    export default App;
