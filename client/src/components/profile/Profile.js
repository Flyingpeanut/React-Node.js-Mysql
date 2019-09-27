import React, { Component } from "react";
import CreateAuction from "./CreateAuction";
import ManageAuctions from "./ManageAuctions";
import {Link,	Route,} from 'react-router-dom';
import AuctionPage from './AuctionPage'
import LiveAuctions from './LiveAuctions'
import LiveAuctionPage from './LiveAuctionPage'

export default class Profile extends Component {

render() {
 const {username, name, last_name, address, country, mail} =this.props.user
  return (
    <div>
    <h1>Καλώς ηρθάτε {username} </h1>
    <React.Fragment >
      {<Link style={linkStyle} to="/profile/create">Create new Auction</Link>}
      {<Link style={linkStyle} to="/profile/manage">Manage Auctions</Link>}
        {<Link style={linkStyle} to="/profile/liveAuctions">Live Auctions</Link>}
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

          exact path={"/profile/manage"}
           render={props => (
             <ManageAuctions
               {...props}
               user={this.props.user}

             />
           )}

         />
         <Route

          exact path={"/profile/liveAuctions"}
           render={props => (
             <LiveAuctions
               {...props}
               user={this.props.user}

             />
           )}

         />
         <Route

           path={"/profile/liveAuctions/:itemId"}
           render={props => (
             <LiveAuctionPage
               {...props}
               user={this.props.user}

             />
           )}

         />
         <Route

           path={"/profile/manage/:itemId"}
           render={props => (
             <AuctionPage
               {...props}
               user={this.props.user}

             />
           )}

         />


        </div>
      );
  }
}


const linkStyle = {
    color: '#000',
     textDecoration: 'none',
     margin: '8px',
}
