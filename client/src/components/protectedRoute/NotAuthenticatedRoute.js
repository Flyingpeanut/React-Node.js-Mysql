import React from 'react';
import { Route,
		Redirect,
	} from 'react-router-dom';



export const NotAuthenticatedRoute = ({ component: Component, ...rest }) => {

	return(
  <Route {...rest} render={(props) => (

    rest.loggedInStatus === false
      ? <Component
       {...props}
       handleLogin={rest.handleLogin}
       loggedInStatus = {rest.loggedInStatus}
       />
      : <Redirect to='/' />

 )} />
)}
