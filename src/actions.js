import store from "./store";
import firebase from "firebase";

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const UPDATE_SETTINGS_SUCCESS = 'UPDATE_SETTINGS_SUCCESS';
export const FETCH_RESTAURANT_SUCCESS = 'FETCH_RESTAURANT_SUCCESS';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const ADD_VISIT = 'ADD_VISIT';
export const REMOVE_VISIT = 'REMOVE_VISIT';
export const FETCH_GROUPS_SUCCESS = 'FETCH_GROUPS_SUCCESS';

import * as parsers from "./parsers";

firebase.initializeApp({
    apiKey: "AIzaSyBnmIDU85Ztt-YMkwYzEEmcRp_6rkfc58U",
    authDomain: "dinner-with-eva.firebaseapp.com",
    databaseURL: "https://dinner-with-eva.firebaseio.com",
    storageBucket: "dinner-with-eva.appspot.com",
    messagingSenderId: "106296135822"
});

firebase.database().goOnline();


export const groupRestaurantChange = (restaurant, value) => {
    let db = firebase.database();

    let user = store.getState().authentication.user;

    db.ref(`/groups/${user.groupId}/restaurants/${restaurant.id}`).set(value === true ? true : null);
    return {
        type: "GROUP_RESTAURANT_CHANGE_SUCCESS"
    }
};


export const createGroup = (group) => {
    return (dispatch) => {
        let db = firebase.database();

        let userId = store.getState().authentication.user.id;
        let groupRef = db.ref(`/groups`).push({
            name: group.name
        });

        updateSettings({groupId: groupRef.key});

        dispatch({
            type: "CREATE_GROUP_SUCCESS"
        })
    }
};

export const updateSettings = (settings) => {
    let userId = store.getState().authentication.user.id;

    let db = firebase.database();

    if (settings.groupId != null) {
        let oldGroupId = store.getState().authentication.user.groupId;
        db.ref(`/groups/${oldGroupId}/visits`).off("child_added");
        db.ref(`/groups/${oldGroupId}/visits`).off("child_removed");
    }

    db.ref(`/users/${userId}`).update(settings);

    if (settings.groupId != null) {



        db.ref(`/groups/${settings.groupId}/visits`).on("child_added", (snapshot) => {
            let visit = snapshot.val();
            visit.id = snapshot.key;
            store.dispatch({
                type: ADD_VISIT,
                visit: visit,
                groupId: settings.groupId
            });
        });


        db.ref(`/groups/${settings.groupId}/visits`).on("child_removed", (snapshot) => {
            let visit = snapshot.val();
            visit.id = snapshot.key;
            store.dispatch({
                type: REMOVE_VISIT,
                visit: visit,
                groupId: settings.groupId
            });
        });

    }

    return {
        type: UPDATE_SETTINGS_SUCCESS,
        userId: userId,
        settings: settings
    }
};


export const fetchGroupsSuccess = (groups) => {
    for (let group of groups) {
        group.members = mapToArray(group.members);
        group.visits = []; // Visits are fetched by separate callback
        group.restaurants = mapToArray(group.restaurants);
    }

    return {
        type: FETCH_GROUPS_SUCCESS,
        groups: groups
    }
};

export const fetchGroups = () => {
    return (dispatch) => {
        let db = firebase.database();
        db.ref("/groups").once("value", (snapshot) => {
            let groups = snapshot.val();

            dispatch(fetchGroupsSuccess(mapToArray(groups)));
        });
    };
};

export const login = (response) => {
    return (dispatch) => {
        let db = firebase.database();
        let reference = db.ref(`/users/${response.userID}`);
        reference.once("value", (snapshot) => { //TODO: use .then()
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

            dispatch({
                type: LOGIN_SUCCESS,
                user: user
            });


            updateSettings({groupId: user.groupId});

        });
    };
};

export const fetchUsersSuccess = (users) => {
    return {
        type: FETCH_USERS_SUCCESS,
        users: users
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

                dispatch(fetchUsersSuccess(mapToArray(users)));
            });
        });
    };
};

function mapToArray(map) {
    let result = [];
    for (let key in map) {
        if (map.hasOwnProperty(key)) {
            let item = map[key];
            if (item instanceof Object) {
                item.id = key;
            } else {
                item = {
                    id: key,
                    value: item
                }
            }
            result.push(item);
        }
    }
    return result;
}


export const visit = (restaurant) => {

    let today = new Date().toISOString().split("T")[0];

    let state = store.getState();

    let groupId = state.authentication.user.groupId;
    let group = state.groups.list.find(g => g.id == groupId);

    if (group.visits.some(v => v.id === today && v.restaurantId === restaurant.id)) {
        firebase.database().ref(`/groups/${groupId}/visits/${today}`).remove();
    } else {
        firebase.database().ref(`/groups/${groupId}/visits/${today}`).remove(); //TODO: this is here just because i dont listen to value change but only child added/removed
        firebase.database().ref(`/groups/${groupId}/visits/${today}`).set({ restaurantId: restaurant.id });
    }

    return {
        type: "VISIT",
    }
};