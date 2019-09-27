import React from 'react';
import { Route,
		Redirect,
	} from 'react-router-dom';


// an o xrhsths prospathisei na mpei sto se auto to Route xwris na einai logged inspect
// tote ton kanei redirect gia login
export const PrivateRoute = ({ component: Component, ...rest }) => {
	return(
  <Route {...rest} render={(props) => (

    rest.loggedInStatus === true
      ? <Component
	  {...props}
	  user={rest.user}
	  loggedInStatus = {rest.loggedInStatus}
	  />
      : <Redirect to='/auth/login' />

 )} />
)}
