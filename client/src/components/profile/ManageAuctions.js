import React from 'react';
//import { Formik, Field, Form, ErrorMessage } from 'formik';
//import * as Yup from 'yup';
import axios from "axios";
import './profile.css';
import ListItemAuction from '../list/ListItemAuction'

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

  fetchInactiveAuctions() {
    axios
      .get("http://localhost:9001/profile/manage",
            { withCredentials: true })
      .then(({data} )=> {
        console.log(data);
      if ( data.status){
            this.setState({auctions:data.auctions})
            this.setState({loaded:true})

    }
    if (!data.status || data.items === []) {
        this.setState({message:'Δεν υπάρχουν ανενεργές δημοπρασίες.'})

        }
      })
      .catch(error => {
          this.setState({message:'Εμφανίστηκε κάποιο λάθος!'})
          console.log("bad search field ", error);
      });
  }

  componentDidMount() {
     this.fetchInactiveAuctions();

 }


  render() {
      const {loaded,auctions,message} =this.state
      return (
        <React.Fragment>
            <h1>Manage your inactive auctions</h1>
            <h2>{message}</h2>
            {loaded&&(<h2>These are your inactive auctions</h2>)}
            <div>
                <ul>
                {auctions.map((item) => <ListItemAuction key = {item.id}
                   item    = {item}
                   history ={this.props.history}
                />)}
                </ul>
            </div>
      </React.Fragment>
      );
    }
}
