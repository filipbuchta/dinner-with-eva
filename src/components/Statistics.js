import React, { Component } from 'react';
import { connect } from "react-redux";
import { Doughnut } from "react-chartjs-2";

class Statistics extends Component {
    render() {
        let restaurants = this.props.restaurants;
        let visits = this.props.visits;

        let data = {};
        data.labels = [];
        let dataset = {
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: []
        };

        data.datasets = [dataset];

        for (let restaurant of restaurants) {
            let visitCount = visits.filter(v => v.restaurantId === restaurant.id).length;
            if (visitCount > 0) {
                data.labels.push(restaurant.name);
                dataset.data.push(visitCount);
            }
        }


        for (let i = 0; i < data.labels.length; i++) {
            dataset.backgroundColor.push(selectColor(i, data.labels.length));
        }






        return (<div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h3>Statistics</h3>
                    <Doughnut data={data} options={{animation: {duration:0, animateScale: false, animateRotate: false}}} />
                </div>
            </div>
        </div>)
    }
}

export default connect(
    (state, ownProps) => {
        return {
            restaurants: state.restaurants.list,
            visits: state.visits.list
        }
    }
)(Statistics);


function selectColor(colorNum, colors){
    if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
    return "hsl(" + (colorNum * (360 / colors) % 360) + ",100%, 87.5%)";
}