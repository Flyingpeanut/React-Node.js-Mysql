import React, { Component }  from 'react';
import Toggle from '../list/Toggle';
import  {Link} from 'react-router-dom'

export default class ListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bidPrice : -1,

        }
        console.log(this.props.loggedInStatus);
        console.log(this.state);
  }



     render() {
         const  {
             id,
             name,
            // num_of_bids,
             description,
             location,
             country,
            // seller_rating,
             buy_price,
             curently,
            // username,
            // categories,
         } = this.props.item

        return(
            <div>
            <li style={styles.container}>
                <div style={styles.header}>
                    <h3>Τίτλος   : {name}</h3>
                    <h3>Τρέχουσα Προσφορά   : {curently} €</h3>

                    <div style={styles.header}>
                        <Link style={styles.right} to={`/item/${id}`}> >> Το θέλω  </Link>
                    </div>

                </div>
                <Toggle>
                 {({on, toggle}) => (
                    <div>
                        { on && (<div style={styles.body}>
                            <h3>Τιμή αγοράς : {buy_price} €</h3>
                            <h4>Περιγραφή   : {description}</h4>
                            <h4>Διεύθυνση   : {location}</h4>
                            <h4>Χώρα    : {country}</h4>

                        </div>)}
                        <button onClick={toggle}>
                        {on ? 'Λιγότερα' : 'Περισσότερα'}
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

    },
    right:{
        margin:'3% 70%',
        background:'blue',
        color:'white',
        fontSize: '1.3em',
        textDecoration: 'none',
        padding: '8px',
    }
}
