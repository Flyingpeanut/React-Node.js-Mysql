import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';



export default class ItemPage extends Component {

    constructor(props) {
      super(props);
      console.log(this.props.loggedInStatus);
      this.state = {
          name:'',
          description:'',
          first_bid:'',
          buy_price:'',
      }

    }

    fetchUserData() {
        const itemId = this.props.match.params.itemId
        console.log(itemId);
      axios
        .get(`http://localhost:9001/profile/fetch/notStartedAuction/${itemId}` ,{ withCredentials: true })
        .then(({data} )=> {
			console.log(data.item);
            console.log(data.item[0]);
		  if ( data.status && data.item[0]){
              const {name,description,buy_price,first_bid} = data.item[0].item
              this.setState({name})
              this.setState({description })
              this.setState({buy_price})
              this.setState({first_bid})
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


  render() {
      const {name,description,buy_price,first_bid} = this.state
      console.log(this.state);
    return (
        <div>

        </div>
    );
  }
}
/*css is in App.css*/
