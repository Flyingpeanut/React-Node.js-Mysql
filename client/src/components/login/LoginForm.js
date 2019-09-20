import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { 	 Link	} from 'react-router-dom';

export default class LoginForm extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
          serverError: '',
          fireRedirect: false,
          redirectLocation: ''
      };
    }

    render() {
        return (
            <div>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string()
                        .required('Username is required'),
                    password: Yup.string()
                        .min(6, 'Password must be at least 6 characters')
                        .required('Password is required'),

                })}
                onSubmit={fields => {
                    axios.post('http://localhost:9001/auth/login', {
                        username: fields.username,
                        password: fields.password
                    },
                    {
                        withCredentials: true
                    })
                    .then(res => {
                         if (res.data.errors) {
                             // better error handling
                            alert(res.data.errors[0].msg)
                        }
                        else{
                            //probably better
                            //localStorage.setItem("userToken", response.data.token);
                            this.props.handleSuccessfulAuth(res.data)

                        }
                    })
                    .catch(res => alert(res))
                }}
                render={({ errors, status, touched }) => (
                    <Form>
                    <h1>Sign In Here</h1>

                        <Link to="/auth/register">Not Registered ?</Link>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                            <ErrorMessage name="username" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Sign In</button>
                        </div>
                    </Form>


                )}
            />
            </div>
        )
    }
}
