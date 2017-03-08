import React, {Component} from 'react';

import {connect} from 'react-redux';

import {createGroup} from "./../actions";


import {hashHistory} from "react-router";

class NewGroup extends Component {

    constructor() {
        super();
        this.onSubmit = this.onSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);

    }
    onInputChange(e) {
        let change = {};
        change[e.target.name] = e.target.value;
        this.setState(change);
    }

    onSubmit(e) {
        this.props.createGroup(this.state);

        e.preventDefault();

        hashHistory.push("./group");
    }

    render() {
        return (<div className="row">
            <div className="col-lg-12">
                <h3>New group</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" className="form-control" required="required" name="name" onChange={ this.onInputChange }  />
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                </form>
            </div>
        </div>)
    }
}

export default connect(
    (state, ownProps) => {
        return {
            user: state.authentication.user,
        }
    },
    (dispatch, ownProps) => {
        return {
            createGroup: (group) => {
                dispatch(createGroup(group));
            }
        }
    }
)(NewGroup);