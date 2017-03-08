import {combineReducers} from 'redux'
import {LOGIN_SUCCESS, REMOVE_VISIT, FETCH_GROUPS_SUCCESS, ADD_VISIT, FETCH_RESTAURANT_SUCCESS, UPDATE_SETTINGS_SUCCESS, FETCH_USERS_SUCCESS} from "./actions"

function groups(state = {list: []}, action) {
    switch (action.type) {
        case FETCH_GROUPS_SUCCESS:
            return {...state, list: action.groups };
        case ADD_VISIT:
            return {...state, list: state.list.map( (group) => group.id === action.groupId ? { ...group, visits: [...group.visits, action.visit] } : group)};
        case REMOVE_VISIT:
            return {...state, list: state.list.map( (group) => group.id === action.groupId ? { ...group, visits: group.visits.filter(v => v.id !== action.visit.id) } : group)};
        default:
            return state;
    }
}

function users(state = {list: []}, action) {
    switch (action.type) {
        case UPDATE_SETTINGS_SUCCESS:
            return {...state, list: state.list.map( (user) => user.id === action.userId ? Object.assign(user, action.settings) : user)};
        case FETCH_USERS_SUCCESS:
            return {...state, list: action.users };
        default:
            return state;
    }
}

function authentication(state = {user: null}, action) {
    switch (action.type) {
        case UPDATE_SETTINGS_SUCCESS:
            return {...state, user: Object.assign(state.user, action.settings)};
        case LOGIN_SUCCESS:
            return {...state, user: action.user };
        default:
            return state;
    }
}

function restaurants(state = {list: []}, action) {
    switch (action.type) {
        case FETCH_RESTAURANT_SUCCESS:
            return {...state, list: [...state.list, action.restaurant]};

        default:
            return state;
    }
}

const rootReducer = combineReducers({
    users,
    authentication,
    restaurants,
    groups
});

export default rootReducer;