import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css';

import Menu from "./Menu"

class App extends Component {

  render() {
      return (
        <div className="container">
          <div className="header clearfix">
            <Menu />

            <h3 className="text-muted">{
                location.hostname == "kam-pujdeme-dnes-na-obed-evo.cz" ? "Kam půjdeme dnes na oběd Evo?" : "Where should we eat?"
            }</h3>
          </div>
            {this.props.children}
          <hr />
        </div>)
  }
}

export default App;
