import React, { Component }  from 'react';
import  {Link} from 'react-router-dom'


export default class ListLiveAuction extends Component {
    constructor(props) {
      super(props);
      this.state = {
          endDate : '',
          startDate:  '',
          message:'',
      }

    }

     render() {

         const {
             id,
             name,
             curently,
             first_bid,
             num_of_bids,
         } = this.props.item;


        return(

            <div>
            <li style={styles.container}>
                <div style={styles.header}>
                        <h3>Τίτλος δημοπρασίας : {name}</h3>
                        <h4>Τρέχουσα τιμή : {curently}</h4>
                        <h4>Πλήθος προσφορών  : {num_of_bids}</h4>
                        <h4>Αρχική τιμή  : {first_bid}</h4>
                        <Link style={styles.right} to={`/profile/liveAuctions/${id}`} >Περισσότερες πληροφορίες</Link>
                </div>

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

    },
    right:{
        margin:'3% 70%',
        background:'blue',
        color:'white',
        fontSize: '1.3em',
        textDecoration: 'none',
        padding: '8px',
    },
    linkStyle : {
        color: '#000',
         textDecoration: 'none',
         margin: '8px',
    }
}
