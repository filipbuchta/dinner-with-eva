import React, {Component} from 'react';

import RestaurantList from "./RestaurantList";


class Dashboard extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <RestaurantList restaurants={this.props.restaurants} />
                    </div>
                </div>
            </div>)
    }
}


export default Dashboard;