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
        <Formik
            initialValues={{
                name:'',
                description:'',
                first_bid:'',
                buy_price:'',
                startDate:'',
                endDate:'',

            }}
            validationSchema={Yup.object().shape({
                itemName: Yup.string(),
                description: Yup.string(),

                buy_price:   Yup.number(),
                first_bid:    Yup.number().when(
                          'buy_price',
                          (buy_price, schema) => (buy_price && schema.max(buy_price)),
                      ),
              startDate: Yup.date()
                      .min(new Date(),'it must start later than today'),
              endDate: Yup.date()
                    .when(
                      'startDate',
                      (startDate, schema) => (startDate && schema.min(startDate).required('must pick end date with start date')),
                  ),


            })}
           onSubmit= { fields => {
               console.log(fields);

                const {buy_price, description, first_bid, itemName, startDate, endDate} = fields
                const {itemId} = this.props.match.params
                if (!this.confirmation('Είστε σίγουρος για τις αλλαγές; Υπενθύμιση με την αρχικοποίηση ημερομηνίων ξεκινάει επίσημα η δημοπρασία και δεν μπορεί να αλλάξει μετά')){
                    return console.log('nope');
                }
               axios.post(`http://localhost:9001/profile/manage/${itemId}`, {
                   buy_price,
                   description,
                   first_bid,
                   name:itemName,
                   started: new Date(startDate),
                   ended: new Date(endDate),
               },
               {
                   withCredentials: true
               })
               .then(({data}) => {
                    if (data.status) {
                        // better error handling
                       alert('Successful auction creation')
                       this.props.history.push('/profile')
                   }
                   else{
                       alert('Something went bad')

                   }

               })
               .catch(res => alert(res))
           }}
            render={({ errors, status, touched}) => (


                <Form >
                      <Link to="/profile">back to profile</Link>
                        <h1>Συμπλήρωστε όποιο πεδίο θέλετε να αλλάξει</h1>


                        <div className="form-group">
                            <label htmlFor="itemName">Item name</label>
                            <Field name="itemName" placeholder={name} type="text" className={'form-control' + (errors.itemName && touched.itemName ? ' is-invalid' : '')} />
                            <ErrorMessage name="itemName" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <Field name="description" placeholder={description} type="text" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                            <ErrorMessage name="description" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="buy_price">Buy price</label>
                            <Field name="buy_price" placeholder={buy_price} type="text" className={'form-control' + (errors.buy_price && touched.buy_price ? ' is-invalid' : '')} />
                            <ErrorMessage name="buy_price" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="first_bid">Starting price</label>
                            <Field name="first_bid" placeholder={first_bid} type="text" className={'form-control' + (errors.first_bid && touched.first_bid ? ' is-invalid' : '')} />
                            <ErrorMessage name="first_bid" component="div" className="invalid-feedback" />
                        </div>

                        <h2>Συμπλήρωστε τις ημερομηνίες για ενεργοποίηση δημοπρασίας</h2>
                        <div className="form-group">
                            <label htmlFor="startDate">Start date</label>
                            <Field name="startDate" type="date" className={'form-control' + (errors.startDate && touched.startDate ? ' is-invalid' : '')} />
                            <ErrorMessage name="startDate" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endDate">End date</label>
                            <Field name="endDate" type="date" className={'form-control' + (errors.endDate && touched.endDate ? ' is-invalid' : '')} />
                            <ErrorMessage name="endDate" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Τροποποίηση</button>
                            <button type="reset" className="btn btn-secondary">Επαναφορά</button>
                        </div>
                        </Form>

            )}
        />
    );
  }
}
/*css is in App.css*/
