import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { 	Link	} from 'react-router-dom';
import * as Yup from 'yup';
import axios from "axios";

export default class Register extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
          serverError: '',
          fireRedirect: false,
          redirectLocation: ''
      };
    }

      CancelToken = axios.CancelToken;
      source = this.CancelToken.source();

      abortController = new AbortController();

      componentDidMount(){
          console.log('register temp');
          let log = localStorage.getItem('user')
          if(log){
              console.log(log);
          }
      }

     componentWillUnmount() {
         this.source.cancel("Operation canceled by the user.");
      }
    render() {
        return (
            <div>
            <Formik
                initialValues={{
                    username:   '',
                    firstName:  '',
                    lastName:   '',
                    country:    '',
                    address:    '',
                    afm:        '',
                    email:      '',
                    password:   '',
                    confirmPassword: '',
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string()
                        .required('το όνομα χρήστη είναι υποχρεωτικό'),
                    firstName: Yup.string()
                        .required('Το όνομα είναι υποχρεωτικό'),
                    lastName: Yup.string()
                        .required('το επίθετο είναι υποχρεωτικό'),
                    country: Yup.string()
                            .required('η χώρα είναι υποχρεωτική'),
                    afm:   Yup.number()
                           .integer('Το ΑΦΜ είναι ακέραιος')
                           .min(100000000, 'Έχει 9 ψηφία')
                           .max(999999999, 'Έχει 9 ψηφία')
                           .required('ΑΦΜ είναι υποχρεωτικό'),
                    address:    Yup.string()
                            .required('Η διεύθυνση είναι υποχρεωτική'),
                    email: Yup.string()
                        .email('Λάθος ηλεκτρονική διεύθυνση')
                        .required('Η ηλεκτρονική διεύθυνση είναι υποχρεωτική'),
                    password: Yup.string()
                        .min(6, 'Ο κωδικός πρέπει να περιέχει τουλάχιστον 6 χαρακτήρες')
                        .required('Ο κωδικός είναι υποχρεωτικός'),
                    confirmPassword:  Yup.string()
                        .oneOf([Yup.ref('password'), null], 'Οι κωδικόι πρέπει να ταιριάζουν')
                        .required('Η επιβεβαίωση κωδικού είναι υποχρεωτική')
                })}

                onSubmit={(fields, actions) => {
                    console.log(fields);
                    try {
                        axios.post('http://localhost:9001/auth/register', {
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

                render={({ errors, status, touched }) => (


                    <Form>
                        <h1>Register Here</h1>

                        <Link to="/auth/login">Already registered??</Link>
                        <div className="form-group">
                            <label htmlFor="username">Όνομα χρήστη</label>
                            <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                            <ErrorMessage name="username" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName">Όνομα</label>
                            <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                            <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Επίθετο</label>
                            <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                            <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Ηλεκτρονική διεύθυνση</label>
                            <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Διεύθυνση</label>
                            <Field name="address" type="text" className={'form-control' + (errors.address && touched.address ? ' is-invalid' : '')} />
                            <ErrorMessage name="address" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Χώρα</label>
                            <Field name="country" type="text" className={'form-control' + (errors.country && touched.country ? ' is-invalid' : '')} />
                            <ErrorMessage name="country" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="afm">ΑΦΜ</label>
                            <Field name="afm" type="text" className={'form-control' + (errors.afm && touched.afm ? ' is-invalid' : '')} />
                            <ErrorMessage name="afm" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Κωδικός</label>
                            <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Επιβεβαίωση Κωδικού</label>
                            <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                            <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Εγγραφή</button>
                            <button type="reset" className="btn btn-secondary">Επαναφορά</button>
                        </div>
                    </Form>

                )}
            />
              </div>

        )
    }
}

//export { Register };
