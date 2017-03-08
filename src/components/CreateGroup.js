import React, {Component} from 'react';

import {connect} from 'react-redux';

import {visit} from "./../actions";

import Statistics from "./Statistics";


class Group extends Component {
    render() {
        return (<div className="row">
            <div className="col-lg-12">
                <h3>{this.props.group.name}</h3>

                <Statistics group={this.props.group} restaurants={this.props.restaurants} />

                <h4>Members</h4>
                {this.props.group.members.map(
                    (member) => {
                        let found = this.props.users.find( u => u.id === member.id);
                        if (found == null) return null;
                        return <div key={found.id}>{found.name}</div>
                    }
                )}
                <h4>Restaurants</h4>
                {this.props.group.restaurants.map(
                    (restaurant) => {
                        let found = this.props.restaurants.find( r => r.id === restaurant.id);
                        if (found == null) return null;
                        return <div key={found.id}>{found.name}</div>
                    }
                )}
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
            group: state.groups.list.find( g => g.id === state.authentication.user.groupId),
        }
    },
    (dispatch, ownProps) => {
        return {
            onVisit: (restaurant) => {
                dispatch(visit(restaurant));
            }
        }
    }
)(Group);