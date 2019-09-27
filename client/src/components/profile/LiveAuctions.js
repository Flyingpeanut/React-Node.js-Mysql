import React from 'react';
//import { Formik, Field, Form, ErrorMessage } from 'formik';
//import * as Yup from 'yup';
import axios from "axios";
import { 	 Link	} from 'react-router-dom';
import './profile.css';
import ListLiveAuction from '../list/ListLiveAuction'

export default class ManageAuctions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
          auctions: [],
          filtered:[],
          message:'',
          loaded:false,
      };
  }

  fetchActiveAuctions() {
    axios
      .get("http://localhost:9001/profile/fetch/userActiveAuctions",
            { withCredentials: true })
      .then(({data} )=> {
          console.log(data);
          if ( data.status){
            this.setState({auctions:data.auctions})
            this.setState({loaded:true})

            }
        if (!data.status || data.items === []) {
            this.setState({message:'Δεν βρέθηκαν ενεργές δημοπρασίες.'})

            }
          })
      .catch(error => {
          this.setState({message:'Εμφανίστηκε κάποιο λάθος!'})
          console.log("bad search field ", error);
      });
  }

  componentDidMount() {
     this.fetchActiveAuctions();

 }


  render() {
      const {loaded,auctions,message} =this.state
      return (
        <React.Fragment>
            <h1>Manage your active auctions</h1>
            <h2>{message}</h2>
            {loaded&&(<h2>These are your active auctions</h2>)}
            <div>
                <ul>
                {auctions.map((item) => <ListLiveAuction key = {item.id}
                   item    = {item}
                   history ={this.props.history}
                />)}
                </ul>
            </div>
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
