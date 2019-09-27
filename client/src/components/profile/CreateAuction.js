import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { 	 Link	} from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import MySelect from '../list/MultiSelect'


function createOption(label){
    return {
        label,
        value:label.toLowerCase().replace(/\W/g, ''),
    }
}


export default class CreateAuction extends React.Component {

    state = {
        isLoading:false,
        options: this.testOptions,
    }
    testOptions = [
        createOption('whatver'),
        createOption('123341 1312'),
        createOption('exampl'),
    ]

    handleCreate (inputValue) {
        console.log(inputValue);
    //    this.setState({ isLoading: true });

      const { multiValue, options } = this.state;
      const newOption = createOption(inputValue);
      console.log(newOption);
      this.setState({
              options: [...options, newOption],

      });

      console.log(this.state);
  };
  render() {
      const { isLoading, options, value } = this.state;
      return (

          <Formik
              initialValues={{
                  itemName:   '',
                  description:  '',
                  buy_price:    '',
                  first_bid:        '',
                  categories:   '',
              }}
              validationSchema={Yup.object().shape({
                  itemName: Yup.string()
                      .required('name thy product'),
                  description: Yup.string()
                      .required('describe thy product'),
                  buy_price:   Yup.number()
                         .required('add buy price'),
                  first_bid:    Yup.number().when(
                            'buy_price',
                            (buy_price, schema) => (buy_price && schema.max(buy_price)),
                        ).required('place your starting price'),
                categories: Yup.string().required('please insert at least one category you can separate multiple with space')



              })}
             onSubmit= { fields => {
                 console.log(fields);
                  const {buy_price, categories, description, first_bid, itemName} = fields
                 if (categories==='') {
                     alert('please choose at least one category')
                 }

                 axios.post('http://localhost:9001/profile/create', {
                     buy_price,
                     categories,
                     description,
                     first_bid,
                     itemName,
                 },
                 {
                     withCredentials: true
                 })
                 .then(({data}) => {
                      if (data.status) {
                          // better error handling
                         alert('Successful auction creation')
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
                          <h1>create auction</h1>


                          <div className="form-group">
                              <label htmlFor="itemName">Item name</label>
                              <Field name="itemName" type="text" className={'form-control' + (errors.itemName && touched.itemName ? ' is-invalid' : '')} />
                              <ErrorMessage name="itemName" component="div" className="invalid-feedback" />
                          </div>
                          <div className="form-group">
                              <label htmlFor="description">Description</label>
                              <Field name="description" type="text" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                              <ErrorMessage name="description" component="div" className="invalid-feedback" />
                          </div>
                          <div className="form-group">
                              <label htmlFor="buy_price">Buy price</label>
                              <Field name="buy_price" type="text" className={'form-control' + (errors.buy_price && touched.buy_price ? ' is-invalid' : '')} />
                              <ErrorMessage name="buy_price" component="div" className="invalid-feedback" />
                          </div>
                          <div className="form-group">
                              <label htmlFor="first_bid">Starting price</label>
                              <Field name="first_bid" type="text" className={'form-control' + (errors.first_bid && touched.first_bid ? ' is-invalid' : '')} />
                              <ErrorMessage name="first_bid" component="div" className="invalid-feedback" />
                          </div>
                          <div className="form-group">
                              <label htmlFor="categories">Categories </label>
                              <Field name="categories" type="text" className={'form-control' + (errors.categories && touched.categories ? ' is-invalid' : '')} />
                              <ErrorMessage name="categories" component="div" className="invalid-feedback" />
                          </div>

                          <div className="form-group">
                              <button type="submit" className="btn btn-primary mr-2">Εγγραφή</button>
                              <button type="reset" className="btn btn-secondary">Επαναφορά</button>
                          </div>
                          </Form>

              )}
          />
      )
  }
}
