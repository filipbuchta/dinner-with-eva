import React, {Component} from 'react';

import {connect} from 'react-redux';

import {groupRestaurantChange, updateGroup} from "./../actions";

import Statistics from "./Statistics";


class Group extends Component {

    constructor() {
        super();
        this.onInputChange = this.onInputChange.bind(this);

    }
    onInputChange(e) {
        let change = {};
        change[e.target.name] = e.target.value;

        this.props.updateGroup(this.props.group.id, change);
    }



    render() {
        if (this.props.group == null) return null;

        return (<div className="row">
            <div className="col-lg-12">
                <div className="row">
                    <div className="col-lg-12">
                        <Statistics group={this.props.group} restaurants={this.props.restaurants}/>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-lg-12">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" required="required" name="name" defaultValue={this.props.group.name} onChange={ this.onInputChange }  />
                            </div>
                        </form>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-lg-6">
                        <h4>Members</h4>
                        {this.props.users.filter(u => u.groupId === this.props.group.id).map(
                            (user) => {
                                return <div key={user.id}>{user.name}</div>
                            }
                        )}
                    </div>
                    <div className="col-lg-6">
                        <h4>Restaurants</h4>
                        {this.props.restaurants.map(
                            (restaurant) => {
                                let found = this.props.group.restaurants.some(r => r.id === restaurant.id);

                                return <div className="form-check" key={restaurant.id}>
                                    <label className="form-check-label">
                                        <input className="form-check-input" type="checkbox" defaultChecked={found}
                                               onChange={ (e) => this.props.onGroupRestaurantChange(restaurant, e.target.checked)}/> {restaurant.name}
                                    </label>
                                </div>
                            }
                        )}
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default connect(
    (state, ownProps) => {
        return {
            user: state.authentication.user,
            restaurants: state.restaurants.list,
            users: state.users.list,
            group: state.authentication.user == null ? null : state.groups.list.find(g => g.id === state.authentication.user.groupId),
        }
    },
    (dispatch, ownProps) => {
        return {
            updateGroup: (id, group) => {
                dispatch(updateGroup(id, group));
            },
            onGroupRestaurantChange: (restaurant, value) => {
                dispatch(groupRestaurantChange(restaurant, value));
            }
        }
    }
)(Group);