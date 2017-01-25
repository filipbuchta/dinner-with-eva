import React, { Component } from 'react';
import { Link } from "react-router";

import 'bootstrap/dist/css/bootstrap.css';

import SignIn from "./SignIn"

class App extends Component {
  render() {
    return (
        <div className="container">
          <div className="header clearfix">
            <nav>
              <ul className="nav nav-pills float-right">
                <li className="nav-item">
                  <Link to="dashboard" className="nav-link" activeClassName="active">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="statistics" className="nav-link" activeClassName="active">Statistics</Link>
                </li>
                <li className="nav-item">
                  <SignIn/>
                </li>
              </ul>
            </nav>
            <h3 className="text-muted">Kam půjdeme dnes na oběd Evo?</h3>
          </div>
            {this.props.children}
          <hr />
        </div>)
  }
}

export default App;
