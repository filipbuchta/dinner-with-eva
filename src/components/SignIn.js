import React, {Component} from 'react';

import {connect} from 'react-redux';

import FacebookLogin from 'react-facebook-login';

import {login} from "../actions";

import 'bootstrap/dist/css/bootstrap.css';

class SignIn extends Component {

    constructor() {
        super();
    }


    render() {
        return (
            <FacebookLogin
                textButton=""
                cssClass="btn btn-outline-primary fa fa-facebook"
                appId="235571820227528"
                autoLoad={true}
                fields="name"
                callback={this.props.onFacebookResponse}
            />
        );
    }
}
export default connect(
    null,
    (dispatch, ownProps) => {
        return {
            onFacebookResponse: (response) => {
                dispatch(login(response));
            }
        }
    }
)(SignIn);