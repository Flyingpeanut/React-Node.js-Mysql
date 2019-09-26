import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { 	 Link	} from 'react-router-dom';

export default class profileForm extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       name: '',
       description: '',
       location: '',
       country: '',
       first_bid: '',
       buy_price: '',
       user_id: '',
       serverError: '',
       fireRedirect: false,
       redirectLocation: ''



    };


   }
   componentDidMount(){
       console.log('burn in hell');

    axios
      .get("http://localhost:9001/auth/login", { withCredentials: true })
      .then(({data} )=> {
          console.log(data.user)
          if ( data.status){

          console.log(data.users);

        }
      })
   }




  render() {
      return (
          <div>
          <Formik
              initialValues={{
                  name:   '',
                  description:  '',
                  location:   '',
                  country:    '',
                  buy_price:    '',
                  first_bid:        '',

              }}
              validationSchema={Yup.object().shape({
                  name: Yup.string()
                      .required('name thy product'),
                  description: Yup.string()
                      .required('describe thy product'),
                  location: Yup.string()
                      .required('location'),
                  country: Yup.string()
                          .required('country'),
                  buy_price:   Yup.number()
                         .required('add buy price'),
                  first_bid:    Yup.string()
                          .required('place your first bid'),

              })}
             onSubmit={(fields, actions) => {
                console.log('thefuck');
              //  actions.preventDefault();


                  try {
    console.log('1');
                     axios.post('http://localhost:9001/profile/add', {
                          posted_data: fields,
                      },
                      { withCredentials: true }
                      )
                      .then(res => {

                          console.log(res.data);
                         if (res.data.errors.length > 0) {
                               // better error handling
                              alert(res.data.errors[0].msg)
                          }
                          else{
                              //probably better
                              //localStorage.setItem("userToken", response.data.token);
                              this.props.handleSuccessfulAuth(res.data.user)

                          }
                      })
                  }catch(err){
                      if (axios.isCancel(err)) {
                          console.log('Request canceled', err.message);
                          throw new Error('Cancelled')
                      }
                      console.log(err);
                  }


                }}




              render={({ handleSubmit,errors, status, touched}) => (


                //  <Form action="/profile/add" method="POST" >
              <Form onSubmit={handleSubmit}>
                    <Link to="/profile">back to profile</Link>
                      <h1>create auction</h1>


                      <div className="form-group">
                          <label htmlFor="namee">name</label>
                          <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                          <ErrorMessage name="name" component="div" className="invalid-feedback" />
                      </div>
                      <div className="form-group">
                          <label htmlFor="description">description</label>
                          <Field name="description" type="text" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                          <ErrorMessage name="description" component="div" className="invalid-feedback" />
                      </div>
                      <div className="form-group">
                          <label htmlFor="location">location</label>
                          <Field name="location" type="text" className={'form-control' + (errors.location && touched.location ? ' is-invalid' : '')} />
                          <ErrorMessage name="location" component="div" className="invalid-feedback" />
                      </div>

                      <div className="form-group">
                          <label htmlFor="buy_price">buy_price</label>
                          <Field name="buy_price" type="text" className={'form-control' + (errors.buy_price && touched.buy_price ? ' is-invalid' : '')} />
                          <ErrorMessage name="buy_price" component="div" className="invalid-feedback" />
                      </div>
                      <div className="form-group">
                          <label htmlFor="first_bid">first bid</label>
                          <Field name="first_bid" type="text" className={'form-control' + (errors.first_bid && touched.first_bid ? ' is-invalid' : '')} />
                          <ErrorMessage name="first_bid" component="div" className="invalid-feedback" />
                      </div>

                      <div className="form-group">
                          <button type="submit" className="btn btn-primary mr-2"  >Εγγραφή</button>
                          <button type="reset" className="btn btn-secondary">Επαναφορά</button>
                      </div>
                      </Form>

              )}
          />
            </div>

      )
  }
}
