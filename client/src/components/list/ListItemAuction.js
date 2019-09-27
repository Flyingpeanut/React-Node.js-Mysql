import React, { Component }  from 'react';
import Toggle from '../list/Toggle';
import  {Link} from 'react-router-dom'
import axios from "axios";
import * as Yup from 'yup';



export default class ListItemAuction extends Component {
    constructor(props) {
      super(props);
      this.state = {
          endDate : '',
          startDate:  '',
          message:'',
      }

      this.dateStartHandle = this.dateStartHandle.bind(this);
      this.dateEndHandle = this.dateEndHandle.bind(this);
      this.submitHandle = this.submitHandle.bind(this);
    }

    submitHandle({target}){

        const {startDate, endDate} = this.state;
        const {id} = this.props.item;
        console.log(startDate);
        console.log(endDate);
        let start = new Date(startDate)
        let end = new Date(endDate)
        let now = new Date()
        if (startDate === '' || endDate === '' ) {

            this.setState({message: 'Please enter both fields'})
            return
        }
        console.log(start);
        console.log(end);
        if (end <= start || now > start) {

            this.setState({message: 'End date should be before valid start date'})
            return
        }
        if (!this.confirmation('  Υπενθύμιση με την αρχικοποίηση ημερομηνίων ξεκινάει\
         επίσημα η δημοπρασία και δεν μπορεί να αλλάξει μετά')){
            return console.log('nope');
        }
        axios.post(`http://localhost:9001/profile/manage/${id}`, {
            ended:end,
            started:start,
        },
        {
            withCredentials: true
        })
        .then(({data}) => {
            console.log(data);
             if (data.status) {
                 // better error handling
                alert('Successful auction activation')
                this.props.history.push('/profile')
            }
            else{
                alert('Something went bad')

            }
        })
        .catch(res => alert(res))
    }

     dateStartHandle({target}){
         console.log(target.name);
         this.setState({startDate:target.value})
         this.setState({message: ''})
     }
     dateEndHandle({target}){
         console.log(target.name);
         this.setState({endDate:target.value})
         this.setState({message: ''})
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

                <Toggle>
                 {({on, toggle}) => (
                    <div>
                        { on && (<div style={styles.body}>
                            <label>Ημερομηνία εκκίνισης  <input name="startDate" onChange={this.dateStartHandle} type='date' value={startDate}/>  </label>
                            <label>Ημερομηνία τέλους    <input name="endDate" onChange={this.dateEndHandle} type='date'value={endDate}/>      </label>
                            <p className= 'error'>{message}</p>
                                <button style={styles.right} onClick={  this.submitHandle}>Ενεργοποίηση</button>
                        </div>)}
                        {!on && (<Link style={styles.right} to={`/profile/manage/${id}`}> => Επεξεργασία  </Link>)}
                        <button onClick={toggle}>
                        {on ? 'Ακύρωση' : 'Ενεργοποίηση δημοπρασίας'}
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
