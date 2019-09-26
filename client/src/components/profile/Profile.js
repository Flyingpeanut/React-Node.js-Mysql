import React, { Component } from "react";
import axios from "axios";
//import Register from "./Register";
import Pform from "./profileForm";
import Pform2 from "./profileform2";
import {Link,	Route,} from 'react-router-dom';
//import { 	 Link	} from 'react-router-dom';
export default class Profile extends Component {

  constructor(props) {

    super(props);
    this.state = {
        username:'',
        approved:''
    }
    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
  }


  fetchUser() {
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




   componentDidMount() {
       this.fetchUser();
   }

render() {
  //const approved =this.state.aproved
  return (
    <div>
    <h1>Welcome {this.state.username} </h1>
    <React.Fragment >
      {<Link style={linkStyle} to="/profile/create">Create new Auction</Link>}
      {<Link style={linkStyle} to="/profile/manage">Manage Auctions</Link>}
    </React.Fragment >

          <Route

           path={"/profile/create"}
           render={props => (
             <Pform
               {...props}
             />
           )}
         />
         <Route

           path={"/profile/manage"}
           render={props => (
             <Pform2
               {...props}
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
