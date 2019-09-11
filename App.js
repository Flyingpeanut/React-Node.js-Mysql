import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import {LoginForm} from './components/login/LoginForm';

import {Register} from './components/login/Register';

//import uuid from 'uuid';
import axios from 'axios';

import './App.css';

class App extends Component {
	state = {
		todos: []
	};

	componentDidMount() {
		axios
			.get('https://jsonplaceholder.typicode.com/todos?_limit=10')
			.then((res) => this.setState({ todos: res.data }));
	}

    	render() {
    		return (
    			<Router>
    				<div className='App'>
    					<div className='container'>
    						<Header />
    						<Route exact path='/'
    							render={(props) => (
    								<React.Fragment>
    									<p>alo</p>
    								</React.Fragment>
    							)}
    						/>
                            <Route path='/register' component={Register} />
    						<Route path='/login' component={LoginForm}   />
    					</div>
    				</div>
    			</Router>
    		);
    	}
    }

    export default App;
