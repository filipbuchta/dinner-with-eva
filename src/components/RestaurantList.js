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
        let visitedToday = this.props.visits.today != null && this.props.visits.today.restaurant === this.props.restaurant.id;

        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="pull-right">
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

                                    let likedBy = this.props.friends.filter(u => u.preferences.split('\n').some(p => value.name.match(new RegExp(p, "i"))));

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
        return (<div className="row">
            <div className="col-lg-12">
                {this.props.restaurants
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((value, index) => <Restaurant key={index} user={this.props.user} restaurant={value}
                                                       friends={this.props.friends} visits={this.props.visits}
                                                       onVisit={() => {
                                                           this.props.onVisit(value);
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
            friends: state.friends.list,
            visits: state.visits
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