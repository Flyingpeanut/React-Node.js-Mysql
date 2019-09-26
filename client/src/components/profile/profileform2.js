import React from 'react';
//import { Formik, Field, Form, ErrorMessage } from 'formik';
//import * as Yup from 'yup';
import axios from "axios";
import { 	 Link	} from 'react-router-dom';
import './profile.css';
export default class profileform2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      filtered:[],
      //fieldChoices:['ongoing', 'started'],
      onlyongoing:false,
      onlyfinished:false,
      selectedOption: '',
      username:'',
      aproved:false

    };
  this.Imin = this.Imin.bind(this);
    this.getauctions = this.getauctions.bind(this);
    this.getongoingauctions = this.getongoingauctions.bind(this);
    this.getcompletedauctions = this.getcompletedauctions.bind(this);
  }
  getauctions() {
    axios
      .get('http://localhost:9001/profile/extra', { withCredentials: true })
      .then(({data} )=> {
  console.log(data.status);
    console.log(data.items);
    if ( data.status){
          this.setState({items:data.items})
          console.log(this.state);
console.log('getting data!!');
        }
      })
      .catch(error => {
        console.log("check login error", error);
      });
  }


  getongoingauctions() {
    axios
      .get('http://localhost:9001/profile/ongoing', { withCredentials: true })
      .then(({data} )=> {
  console.log(data.status);
  console.log(data.items);
    if ( data.status){
          this.setState({items:data.items})
          console.log(this.state);
console.log('getting data!!');
        }
      })
      .catch(error => {
        console.log("check login error", error);
      });
  }




  getcompletedauctions() {
    axios
      .get('http://localhost:9001/profile/finished', { withCredentials: true })
      .then(({data} )=> {
  console.log(data.status);
    if ( data.status){
          this.setState({items:data.items})
          console.log(this.state);
console.log('getting data!!');
        }
      })
      .catch(error => {
        console.log("check login error", error);
      });
  }


  fetchUser() {
    axios
      .get("http://localhost:9001/profile/user", { withCredentials: true })
      .then(({data} )=> {
    if ( data.status){
          this.setState({username:data.users.username})
          this.setState({aproved:data.users.aproved})
          console.log(data.users);
          console.log(this.state.username);
            console.log(this.state.aproved);
           this.setState({filtered: this.state.users})
        }
      })
      .catch(error => {
        console.log("check login error", error);
      });
  }


   Imin() {
  console.log(this.state.aproved)
    if (this.state.aproved) {

            return  <Link style={linkStyle}  to="/profile/add">create auction</Link>;

    }
return <p> </p>
  }



   componentWillMount() {
console.log('mounted')
     this.getauctions();
this.fetchUser();

console.log(this.state.aproved)
 	}


  render() {

      return (
        <React.Fragment>
        <h1> Welcome to bid world</h1>

        <p> here are all your curent auctions</p>

<p> go fornicaTE whit a racoon </p>



<React.Fragment>
     <ul className="list-group">
       {this.state.items.map(items => (
         <li key={items.id} className={items.name}>
        <p>name :   {items.name} </p>
        <p> description :   {items.description} </p>
        <p> curently :  {items.curently} ,final price :  {items.buy_price} </p>
        <p> the auction ends at : </p>
         </li>
       ))}
     </ul>
   </React.Fragment>
   <button onClick={ this.getauctions} style={btnStyle}>
        All auctions
      </button>

      <button onClick={ this.getongoingauctions} style={btnStyle}>
           Ongoing auctions
         </button>
         <button onClick={ this.getcompletedauctions} style={btnStyle}>
              Completed auctions
            </button>
<p> aproved :{this.state.aproved}</p>
{this.Imin()}
      </React.Fragment>
      );
    }
}



const btnStyle = {
  //background: '#ff0000',
  color: '#fff',
  border: 'none',
  padding: '5px 9px',
  borderRadius: '50%',
  cursor: 'pointer',
  float: 'left'
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  margin: '8px',
}
