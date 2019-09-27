import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';


export default class ItemPage extends Component {

    constructor(props) {
      super(props);
      console.log(this.props.loggedInStatus);
      this.state = {
          name:'',
          description:'',
          location:'',
          country:'',
          num_of_bids:'',
          curently:'',
          buy_price:'',
          categories:'',
          seller_rating:'',
          username:'',
          bidPrice:'',
      }
      this.bidItem =  this.bidItem.bind(this)
    }

    fetchUserData() {
        const itemId = this.props.match.params.itemId
      axios
        .get("http://localhost:9001/search/singleItem",{params:{itemId}} ,{ withCredentials: true })
        .then(({data} )=> {
			console.log(data);
		  if ( data.status && data.item){
              this.setState({name : data.item.name})
              this.setState({description : data.item.description})
              this.setState({location : data.item.location})
              this.setState({country : data.item.country})
              this.setState({num_of_bids : data.item.num_of_bids})
              this.setState({curently : data.item.curently})
              this.setState({buy_price : data.item.buy_price})
              this.setState({categories : data.item.categories})
              this.setState({seller_rating : data.item.seller_rating})
              this.setState({username   : data.item.username})
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
    confirmation(message){
        return window.confirm(message)
    }

    bidItem() {
        const itemId = this.props.match.params.itemId
      const {bidPrice,curently,buy_price} = this.state

       if (bidPrice < curently) {
           return alert(`Η ελάχιστη δυνατή προσφορά είναι ${curently} € . ${bidPrice} € δεν είναι αρκετά`)
       }
       if (bidPrice >= buy_price) {
           if (!this.confirmation(` Πρόσφερες περισσότερα απο την τιμή αγοράς ${buy_price} €.
                Θες να συνεχίσεις με τη αγορά του αντικειμένου σε αυτή τη τιμή;`)) {
                return alert(`Η συναλλαγή ακυρώθηκε!`)
           }
           return this.buyItem()
       }
       if (!this.confirmation(`Είσαι σίγουρος οτι θες να καταθέσεις προσφορά αξίας ${bidPrice} € για αυτο το αντικείμενο;`)) {
           return alert(`Η συναλλαγή ακυρώθηκε!`)
       }
    axios
       .post("http://localhost:9001/search/itemBid",
       {itemId, bidPrice},{ withCredentials: true }
      )
       .then(({data} )=> {
         console.log(data);
         if (data.status) {
             console.log('success');
             alert('Συγχαρητήρια! Η προσφορά σας κατωχυρώθηκε. Ανακατεύθυνση στο προφίλ χρήστη.')
            this.props.history.push(`/`)
         }
         else{
             console.log('failt');
         }
       })
       .catch(error => {
         console.log("bad buy field ", error);
     });
   }


    buyItem() {
        const itemId = this.props.match.params.itemId
        if (!this.confirmation(`Είσαι σίγουρος οτι θες να αγοράσεις αυτό αντικείμενο, έναντι ${ this.state.buy_price};`)) {
            return alert(`Η συναλλαγή ακυρώθηκε!`)
        }

     axios
       .post("http://localhost:9001/search/itemBuy",
       {itemId},{ withCredentials: true }
      )
       .then(({data} )=> {
         console.log(data);
         if (data.status) {
             alert('Συγχαρητήρια! Η αγορά ολοκληρώθηκε. Ανακατεύθυνση στο προφίλ χρήστη.')
             this.props.history.push(`/`)

         }
         else{
             console.log('failt');
         }
       })
       .catch(error => {
         console.log("bad buy field ", error);
     });
   }

        bidChange({target}){
            this.setState({bidPrice:target.value})

       }

  render() {

    return (
      <div className='itemPage'>
        <h1>Σελίδα πληροφορίων αντικειμένου</h1>
        <div className='itemBody'>

            <div className='itemHeader'>
                 <h2>{this.state.name}</h2>
                 <p><label>Περιγραφή: {this.state.description}</label></p>
                 <p> <label>Τοποθεσία: {this.state.location} {this.state.country}</label></p>
            </div>
            <div className='bidStatus'> <h3>Κατάσταση δημοπρασίας </h3>
            <h4>    {!this.props.loggedInStatus && <Link  to="/auth/login">Χρειάζεται λογαριασμός για να κάνετε προσφορά!</Link>}</h4>

                    <div><label>Συνολικές προσφορές : {this.state.num_of_bids} </label></div>
                <div >
                    <div><label>Τιμή πώλησης : {this.state.buy_price} </label>
                    {this.props.loggedInStatus &&
                        <button className='right'  onClick={()=>this.buyItem()}>Αγορασέ το τώρα</button>
                    }</div>
                   <div>
                       <label>Υψηλότερη προσφορά : {this.state.curently}</label>
                       {this.props.loggedInStatus && <label>
                       <input   type='number' placeholder={this.state.curently+1}  onChange={this.bidChange.bind(this)} />
                       </label>
                      }
                       {this.props.loggedInStatus && <button className='right'  onClick={this.bidItem}>Στείλε προσφορά</button>}
                   </div>

                </div>



            </div>
            </div>

            <div className='sellerInfo'>
                <h3> Στοιχεία πωλητή: </h3>
                <p> <label>Όνομα χρήστη πωλητή: {this.state.username} </label> <label> Βαθμολογία: {this.state.seller_rating? this.state.seller_rating +'/10' : 'Νέος Πωλητής'}</label></p>
            </div>
         </div>
    );
  }
}
/*css is in App.css*/
