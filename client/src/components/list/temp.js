import React, { Component }  from 'react';
import Toggle from '../list/Toggle';
import axios from 'axios';
import  { Redirect ,withRouter, Link} from 'react-router-dom'

export default class ListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bidPrice : -1,

        }
        console.log(this.props.loggedInStatus);
        console.log(this.state);
  }

  confirmation(){
      return window.confirm('Είσαι σίγουρος ότι θέλεις να πραγματοποιήσεις αυτή τη συναλλαγή;')
  }

  bidItem(itemId,  leastBid) {

    const {bidPrice} = this.state
     console.log(itemId);
     console.log(leastBid);
     console.log(bidPrice);
     if (bidPrice < leastBid) {
         return alert(`Η ελάχιστη δυνατή προσφορά είναι ${leastBid}. ${bidPrice} δεν είναι αρκετά`)
     }
     if (!this.confirmation()) {
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
          // this.props.history.push(`/`)
       }
       else{
           console.log('failt');
       }
     })
     .catch(error => {
       console.log("bad buy field ", error);
   });
 }


  buyItem(itemId) {
      if (!this.confirmation()) {
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
         //  this.props.history.push(`/`)

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
         const  {
             id,
             name,
             num_of_bids,
             description,
             location,
             country,
             seller_rating,
             buy_price,
             curently,
             username,
             categories,
         } = this.props.item

        return(
            <div>
            <li style={styles.container}>
                <div style={styles.header}>
                    <h3>Τίτλος   : {name}</h3>
                    <h3>Τρέχουσα Προσφορά   : {curently} €</h3>
                    {this.props.loggedInStatus ?
                        <label>          Διεκδικησέ το
                        <input   type='number' placeholder={curently+1}  onChange={this.bidChange.bind(this)} />
                        <button  onClick={()=>this.bidItem(id,curently)}>Αγορά</button>
                       </label>
                       : <Link  to="/auth/login">Χρειάζεται λογαριασμός για να κάνετε προσφορά</Link>
                    }
                    <h3>Τιμή αγοράς: {buy_price} €</h3>

                    {this.props.loggedInStatus ?
                        <button  onClick={()=>this.buyItem(id)}>Αγορά</button>
                       : <Link  to="/auth/login">Χρειάζεται λογαριασμός για να αγοράσετε αντικείμενα</Link>
                    }

                </div>
                <Toggle>
                 {({on, toggle}) => (
                    <div>
                        { on && (<div style={styles.body}>
                            <h3>Περιγραφή   : {description}</h3>
                            <h3>Διεύθυνση   : {location}</h3>
                            <h3>Χώρα    : {country}</h3>
                        </div>)}
                        <button onClick={toggle}>
                        {on ? 'Show less' : 'Show more'}
                        </button>
                    </div>
                )}
                </Toggle>

            </li>
            </div>
      )
}
}

const styles = {
    container:{
        margin: '3% 12%',
        fontSize: '0.9em',
        size:'0.7em',
        padding: 8,
        backgroundColor: 'grey',

        border: '1px solid black',
    },
    header:{
        padding:  12,
        fontSize: '0.9em',

    },
    body:{
        padding:  12,
        fontSize: '0.9em',

    }
}
