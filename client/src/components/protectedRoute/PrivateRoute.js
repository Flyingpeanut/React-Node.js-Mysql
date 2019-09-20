import React from 'react';
import { Route,
		Redirect,
	} from 'react-router-dom';



export const PrivateRoute = ({ component: Component, ...rest }) => {
//	console.log(props);
	console.log(rest);
	return(
  <Route {...rest} render={(props) => (

    rest.loggedInStatus === true
      ? <Component {...props} />
      : <Redirect to='/auth/login' />

 )} />
)}
