import React, { Component }  from 'react';


export default class ListItemBid extends Component {

     render() {

         const {
             bid_amount,
             createdAt,
             user:{
                 username,
                // bider_rating,
                 country,
                 address,
             }
         } = this.props.item;


        return(

            <div>
            <li style={styles.container}>
                <div style={styles.header}>

                        <h3>Ποσό προσφοράς: {bid_amount}</h3>
                        <h4>Ημερομηνία προσφοράς : {new Date(createdAt).toDateString()}</h4>
                        <h4>Όνομα χρήστη : {username}</h4>
                        <h4>Διεύθυνση  : {address} , {country}</h4>
                </div>

            </li>
            </div>
      )
}
}

const styles = {
    container:{
        margin: '3%',
        marginLeft:' 30%',
        fontSize: '0.9em',
        size:'0.7em',
        padding: 8,
        backgroundColor: 'grey',
        width: '50%',
        border: '1px solid black',
        display: 'inline-block',
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
