import {combineReducers} from 'redux'
import {LOGIN_SUCCESS, FETCH_VISITS_SUCCESS, VISIT_TODAY_SUCCESS, FETCH_RESTAURANT_SUCCESS, UPDATE_SETTINGS_SUCCESS, FETCH_FRIENDS_SUCCESS} from "./actions"

function visits(state = {list: [], today: null}, action) {
    switch (action.type) {
        case VISIT_TODAY_SUCCESS:
            return {...state, today: action.restaurant };
        case FETCH_VISITS_SUCCESS:
            return {...state, list: action.visits };
        default:
            return state;
    }
}

function friends(state = {list: []}, action) {
    switch (action.type) {
        case UPDATE_SETTINGS_SUCCESS:
            return {...state, list: state.list.map( (friend) => friend.id === action.user ? Object.assign(friend, action.settings)  : friend)};
        case FETCH_FRIENDS_SUCCESS:
            return {...state, list: action.friends };
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
    visits,
    friends,
    authentication,
    restaurants
});

export default rootReducer;