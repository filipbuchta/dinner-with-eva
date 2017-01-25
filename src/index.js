import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';

import {Redirect, Router, IndexRoute, Route, browserHistory} from 'react-router'
import Dashboard from "./components/Dashboard";
import Statistics from "./components/Statistics";
import Settings from "./components/Settings";
import NoMatch from "./components/NoMatch";

import { Provider } from 'react-redux';

import store from "./store";
import {fetchRestaurants, fetchVisits} from "./actions";


store.dispatch(fetchRestaurants());
store.dispatch(fetchVisits());

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>

            <Route path="/" component={App}>
                <IndexRoute component={Dashboard}/>
                <Route path="statistics" component={Statistics}/>
                <Route path="settings" component={Settings}/>
                <Route path="*" component={NoMatch}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);
