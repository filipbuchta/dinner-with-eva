import React, {Component} from 'react';

import {connect} from 'react-redux';

import {visit} from "./../actions"

class Food extends Component {
    render() {
        return (
            <ul>
                <li>
                    {this.props.food.isSoup ?
                        <span><span className="badge badge-pill badge-default">Polévka</span>&nbsp;</span> : ""}
                    {this.props.food.name}
                    &nbsp;
                    {this.props.likedBy.map((value, index) => <span key={index}><span
                        className="badge badge-pill badge-success">{value.nickname}</span>&nbsp;</span>)}
                </li>
            </ul>
        );
    }
}


class Restaurant extends Component {
    render() {
        let canVisit = this.props.user != null;

        let today = new Date().toISOString().split("T")[0];

        let visitedToday = this.props.visits.some(v => v.id === today && v.restaurantId === this.props.restaurant.id);
        let lastVisit = this.props.visits.filter( v => v.restaurantId === this.props.restaurant.id ).sort( (a, b) => Date.parse(b.id) - Date.parse(a.id) )[0];
        let lastVisitDays = lastVisit == null ? -1 : Math.floor(Math.abs(Date.now() - Date.parse(lastVisit.id)) / (1000 * 3600 * 24));
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="pull-right">
                        { lastVisitDays > 0 ? <small className="text-muted">{lastVisitDays + " days ago"}</small>  : "" }
                            &nbsp;
                        { canVisit ?
                            <button className={"btn btn-outline-primary"} onClick={this.props.onVisit}>
                                <i className={"fa " + (visitedToday ? "fa-check-square-o" : "fa-square-o") }/>
                            </button> : ""
                        }
                    </div>
                    <h3>
                        <a href={this.props.restaurant.url}>{this.props.restaurant.name}</a>
                    </h3>
                    <div>
                        {this.props.restaurant.foods
                            .map((value, index) => {
                                    let likedBy = this.props.users.filter(u => u.preferences.split('\n').some(p => value.name.match(new RegExp(p, "i"))));

                                    return <Food key={index} food={value} likedBy={likedBy}/>
                                }
                            )}
                    </div>
                    <br/>
                </div>
            </div>
        );
    }
}

class RestaurantList extends Component {
    render() {

        let visits = this.props.group == null ? [] : this.props.group.visits;

        let users = this.props.group == null ? [] : this.props.users.filter( (user) => user.groupId == this.props.user.groupId );


        return (<div className="row">
            <div className="col-lg-12">
                {this.props.restaurants
                    //.sort((a, b) => visits.filter( v => v.restaurantId == b.id).length - visits.filter( v => v.restaurantId == a.id).length)
                    .filter( restaurant => this.props.group == null || this.props.group.restaurants.some( r => r.id == restaurant.id ))
                    .map((restaurant, index) => <Restaurant key={index} user={this.props.user} restaurant={restaurant}
                                                       users={users} visits={visits}
                                                       onVisit={() => {
                                                           this.props.onVisit(restaurant);
                                                       }}/>)}
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
            group: state.authentication.user == null ? null : state.groups.list.find( g => g.id === state.authentication.user.groupId)
        }
    },
    (dispatch, ownProps) => {
        return {
            onVisit: (restaurant) => {
                dispatch(visit(restaurant));
            }
        }
    }
)(RestaurantList);