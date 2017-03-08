import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';

import {Router, IndexRoute, Route, hashHistory} from 'react-router'
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import NoMatch from "./components/NoMatch";
import Group from "./components/Group";
import CreateGroup from "./components/CreateGroup";

import { Provider } from 'react-redux';

import store from "./store";
import {fetchRestaurants, fetchGroups} from "./actions";


store.dispatch(fetchRestaurants());
store.dispatch(fetchGroups());

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Dashboard}/>
                <Route path="settings" component={Settings}/>
                <Route path="group/new" component={CreateGroup}/>
                <Route path="group" component={Group}/>
                <Route path="*" component={NoMatch}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);
