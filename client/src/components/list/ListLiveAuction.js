import React, { Component }  from 'react';
import Toggle from '../list/Toggle';
import  {Link} from 'react-router-dom'
import axios from "axios";



export default class ListLiveAuction extends Component {
    constructor(props) {
      super(props);
      this.state = {
          endDate : '',
          startDate:  '',
          message:'',
      }

    }
     confirmation(message){
         return window.confirm(message)
     }
     render() {

         const {
             id,
             name,

         } = this.props.item;

         const {

             endDate,
             startDate,
             message
         } = this.state;
        return(

            <div>
            <li style={styles.container}>
                <div style={styles.header}>
                        <h3>Τίτλος δημοπρασίας : {name}</h3>

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
    }
}
