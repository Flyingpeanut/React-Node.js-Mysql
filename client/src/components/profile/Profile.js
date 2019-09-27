import React, { Component } from "react";
import axios from "axios";
//import Register from "./Register";
import CreateAuction from "./CreateAuction";
import ManageAuctions from "./ManageAuctions";
import {Link,	Route,} from 'react-router-dom';
//import { 	 Link	} from 'react-router-dom';
export default class Profile extends Component {

  constructor(props) {

    super(props);

  }

/*
  fetchUser() {
      console.log(this.props);
    axios
      .get("http://localhost:9001/profile/user", { withCredentials: true })
      .then(({data} )=> {
    if ( data.status){
          this.setState({username:data.users.username})
          this.setState({aproved:data.users.aproved})
          console.log(this.state);
           this.setState({filtered: this.state.users})
        }
      })
      .catch(error => {
        console.log("check login error", error);
      });
  }
*/


render() {
 const {username, name, last_name, address, country, admin,have_messg, AFM,mail} =this.props.user
  return (
    <div>
    <h1>Καλώς ηρθάτε {username} </h1>
    <React.Fragment >
      {<Link style={linkStyle} to="/profile/create">Create new Auction</Link>}
      {<Link style={linkStyle} to="/profile/manage">Manage Auctions</Link>}
    </React.Fragment >


    <Route
     exact path={"/profile"}
     render={props => (

             <div>
                 <h3>Στοιχεία χρήστη:</h3>
                 <ul>
                     <li>Ονοματεπώνυμο: {name} {last_name}</li>
                     <li>Τοποθεσία: {address} {country}</li>
                     <li>Επικοινωνία: {mail}</li>

                 </ul>
             </div>

     )}
   />

          <Route

           path={"/profile/create"}
           render={props => (
             <CreateAuction
               {...props}
               user={this.props.user}
             />
           )}
         />
         <Route

           path={"/profile/manage"}
           render={props => (
             <ManageAuctions
               {...props}
               user={this.props.user}

             />
           )}

         />


        </div>
      );
  }
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
