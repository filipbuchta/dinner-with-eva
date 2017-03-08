import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updateSettings} from "./../actions"

class Settings extends Component {

    constructor() {
        super();

        this.onInputChange = this.onInputChange.bind(this);

    }

    onInputChange(e) {
        let change = {};
        change[e.target.name] = e.target.value;

        this.props.updateSettings(change);
    }


    render() {
        if (this.props.user == null)
            return <div>Not logged</div>;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h3>Settings</h3>
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" name="name" defaultValue={this.props.user.name} disabled="disabled" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nickname">Nickname</label>
                                <input type="text" className="form-control" name="nickname" onChange={ this.onInputChange } defaultValue={this.props.user.nickname} placeholder="Enter nickname" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="group">Group</label>
                                <select type="text" className="form-control" name="groupId" onChange={ this.onInputChange } defaultValue={this.props.user.groupId}>
                                    <option label="None" />
                                    {
                                        this.props.groups.map(
                                            (group) => {
                                                return <option key={group.id} label={group.name}>{group.id}</option>
                                            } )
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="preferences">Preferences (regex)</label>
                                <textarea name="preferences" className="form-control" rows="10" onChange={ this.onInputChange } defaultValue={this.props.user.preferences} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>)
    }
}

export default connect(
    (state, ownProps) => {
        return {
            user: state.authentication.user,
            groups: state.groups.list
        };
    },
    (dispatch, ownProps) => {
        return {
            updateSettings: (settings) => {
                dispatch(updateSettings(settings));
            }
        };
    }
)(Settings);