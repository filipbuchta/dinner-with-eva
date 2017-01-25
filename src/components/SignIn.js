import React, {Component} from 'react';
import {Link} from "react-router";

import {connect} from 'react-redux';

import FacebookLogin from 'react-facebook-login';

import {login} from "../actions";

import 'bootstrap/dist/css/bootstrap.css';

class SignIn extends Component {

    constructor() {
        super();
        this.modal = null;
    }


    render() {
        return (
            <div>
                {
                    this.props.user != null ?
                        <Link to="settings" className="nav-link" activeClassName="active">{this.props.user.name}</Link>
                        :
                        <div>
                            <FacebookLogin
                                size="small"
                                appId="235571820227528"
                                autoLoad="true"
                                fields="name"
                                callback={this.props.onFacebookResponse}
                            />
                        </div>

                }

            </div>
        );
    }
}
export default connect(
    (state, ownProps) => {
        return {
            user: state.authentication.user
        }
    },
    (dispatch, ownProps) => {
        return {
            onFacebookResponse: (response) => {
                dispatch(login(response));
            }
        }
    }
)(SignIn);