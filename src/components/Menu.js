import React, {Component} from 'react';
import {connect} from "react-redux"
import {Link, IndexLink} from "react-router";

import SignIn from "./SignIn"


class Menu extends Component {

    render() {
        return (
            <nav>
                <ul className="nav nav-pills float-right">
                    <li className="nav-item">
                        <IndexLink to="/" className="nav-link" activeClassName="active">Menu</IndexLink>
                    </li>
                    {this.props.user != null ?
                        <li className="nav-item">
                            {this.props.user.groupId ?
                                <Link to="group" className="nav-link"
                                      activeClassName="active">{this.props.group == null ? "" : this.props.group.name}</Link>
                                :
                                <Link to="group/new" className="nav-link" activeClassName="active">New group</Link>
                            }
                        </li>
                        : null
                    }

                    <li className="nav-item">
                        {this.props.user != null ?
                            <Link to="settings" className="nav-link"
                                  activeClassName="active">{this.props.user.name}</Link>
                            :
                            <SignIn/>
                        }
                    </li>
                </ul>
            </nav>
        );
    }
}
export default connect(
    (state, ownProps) => {
        return {
            user: state.authentication.user,
            group: state.authentication.user == null ? null : state.groups.list.find(g => g.id === state.authentication.user.groupId)
        };
    },
    (dispatch, ownProps) => {
        return {
            dispatch: dispatch
        };
    }
)(Menu);