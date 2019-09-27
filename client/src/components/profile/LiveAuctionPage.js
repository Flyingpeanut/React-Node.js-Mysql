import React, { Component } from "react";
import axios from 'axios';
import ListItemBid from '../list/ListItemBid'


export default class LiveAuctionPage extends Component {

    constructor(props) {
      super(props);
      console.log(this.props.loggedInStatus);
      this.state = {
          name:'',
          description:'',
          first_bid:'',
          buy_price:'',
          curently:'',
          num_of_bids:'',
          bids:[],
          started:'',
          ended:'',
      }

    }

    fetchUserData() {
        const itemId = this.props.match.params.itemId
        console.log(itemId);
      axios
        .get(`http://localhost:9001/profile/fetch/startedAuction/${itemId}` ,{ withCredentials: true })
        .then(({data} )=> {
            console.log(data);
			console.log(data.item[0]);
		  if ( data.status && data.item[0]){
              const {name,description,buy_price,first_bid,curently,bids,num_of_bids,started,ended} = data.item[0]
              this.setState({
                  name,
                  description,
                  buy_price,
                  first_bid,
                  curently,
                  bids,
                  num_of_bids,
                  started,
                  ended,
              })

          }
          else{
              alert('No item found, probably previous item expired')
          }
        })
        .catch(error => {
          console.log("check login error", error);
        });
    }

    componentDidMount() {
        this.fetchUserData();

    }


  render() {
      const {name,buy_price,first_bid,curently,bids,num_of_bids,started,ended} = this.state
      console.log(this.state);
    return (


            <div>
            <h1>Στοιχεία ενεργής δημοπρασίας </h1>
                <div className="bidInfo">


                    <label>Τίτλος δημοπρασίας: <h2>{name}</h2></label>
                    <label>Τιμή αγοράς: <h3>{buy_price}</h3></label>
                    <label>Τρέχων τιμή:<h3>{curently}</h3></label>
                    <label>Πλήθος προσφορών:<h3>{num_of_bids}</h3></label>
                    <label>Αρχίκη τιμή:<h3>{first_bid}</h3></label>
                    <label>Ημερομηνία εκκίνισης: <h3>{new Date(started).toDateString()}</h3></label>
                    <label>Ημερομηνία λήξης: <h3>{new Date(ended).toDateString()}</h3></label>

                </div>

                <div>

                    <ul>

                    {bids.map((bid) => <ListItemBid key = {bid.id}
                       item    = {bid}
                       history ={this.props.history}
                    />)}
                    </ul>
                </div>

        </div>
    );
  }
}
/*css is in App.css*/
