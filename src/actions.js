import store from "./store";
import firebase from "firebase";

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const UPDATE_SETTINGS_SUCCESS = 'UPDATE_SETTINGS_SUCCESS';
export const FETCH_RESTAURANT_SUCCESS = 'FETCH_RESTAURANT_SUCCESS';
export const FETCH_FRIENDS_SUCCESS = 'FETCH_FRIENDS_SUCCESS';
export const ADD_VISIT = 'ADD_VISIT';
export const REMOVE_VISIT = 'REMOVE_VISIT';

import * as parsers from "./parsers";

firebase.initializeApp({
    apiKey: "AIzaSyBnmIDU85Ztt-YMkwYzEEmcRp_6rkfc58U",
    authDomain: "dinner-with-eva.firebaseapp.com",
    databaseURL: "https://dinner-with-eva.firebaseio.com",
    storageBucket: "dinner-with-eva.appspot.com",
    messagingSenderId: "106296135822"
});

firebase.database().goOnline();


firebase.database().ref("/visits").on("child_added", (snapshot) => {
    let visit = snapshot.val();
    visit.id = snapshot.key;
    store.dispatch({
        type: ADD_VISIT,
        visit: visit
    });
});


firebase.database().ref("/visits").on("child_removed", (snapshot) => {
    let visit = snapshot.val();
    visit.id = snapshot.key;
    store.dispatch({
        type: REMOVE_VISIT,
        visit: visit
    });
});

export const updateSettings = (settings) => {
    let userId = store.getState().authentication.user.id;

    let db = firebase.database();

    db.ref(`/users/${userId}`).update(settings);
    return {
        type: UPDATE_SETTINGS_SUCCESS,
        userId: userId,
        settings: settings
    }
};

const loginSuccess = (user) => {
    return {
        type: LOGIN_SUCCESS,
        user: user
    }
};

export const login = (response) => {
    return (dispatch) => {
        let db = firebase.database();
        let reference = db.ref(`/users/${response.userID}`);
        reference.once("value", (snapshot) => {
            let user = snapshot.val();
            if (!snapshot.exists()) {
                user = {};
                user.name = response.name;
                user.nickname = user.name;
                user.preferences = "";
            }

            if (!snapshot.exists()) {
                reference.set(user);
            }

            user.id = snapshot.key;

            dispatch(loginSuccess(user));
        });
    };
};

export const fetchFriendsSuccess = (friends) => {
    return {
        type: FETCH_FRIENDS_SUCCESS,
        friends: friends
    }
};



export const fetchRestaurantSuccess = (resutarant) => {
    return {
        type: FETCH_RESTAURANT_SUCCESS,
        restaurant: resutarant
    }
};

export const fetchRestaurants = () => {
    let db = firebase.database();

    return (dispatch) => {
        db.ref("/restaurants").once("value", (snapshot) => {
            let restaurants = mapToArray(snapshot.val());
            for (let restaurant of restaurants) {
                let parser = parsers[restaurant.id];

                if (parser == null) {
                    restaurant.foods = [];
                    dispatch(fetchRestaurantSuccess(restaurant));
                    continue;
                    //throw new Error("Parser for " + restaurant.id + " not defined");
                }
                parser(restaurant).then(menu => {
                    restaurant.foods = menu;

                    for (let food of restaurant.foods) {
                        food.people = [];
                    }
                    dispatch(fetchRestaurantSuccess(restaurant));
                });
            }


            db.ref("/users").once("value", (snapshot) => {
                let users = snapshot.val();

                dispatch(fetchFriendsSuccess(mapToArray(users)));
            });
        });
    };
};

function mapToArray(map) {
    let result = [];
    for (let key in map) {
        if (map.hasOwnProperty(key)) {
            let item = map[key];
            item.id = key;
            result.push(item);
        }
    }
    return result;
}


export const visit = (restaurant) => {

    let today = new Date().toISOString().split("T")[0];

    let state = store.getState();
    if (state.visits.list.some(v => v.id == today && v.restaurantId == restaurant.id)) {
        firebase.database().ref(`/visits/${today}`).remove();
    } else {
        firebase.database().ref(`/visits/${today}`).set({ restaurantId: restaurant.id });
    }

    return {
        type: "VISIT",
    }
};