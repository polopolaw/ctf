import {
    GETCOMPLAIINTSGOOD,
    GETCOMPLAIINTSCOURIERS,
    GETCOURIERS} from "../../utils/constants";

const initialState = {
    complaints_good:[
        {
            good:{
                id:  "1",
                name: "",
                image: "",
                description: "",
                weight: 0
            },
            complaint:  "",
            image: "",
        },

    ],
    complaints_couriers:[
        {
            complaint:  "",
            courier: {
                courierId: "",
                nickname: ""
            },
        },
    ],
    couriers:[
        {
            id:  "",
            nickname: "",
        },

    ],
};

export function complaintsReducer(state = initialState, action) {
    switch (action.type) {
        case GETCOMPLAIINTSGOOD:
            return Object.assign({}, state, {                
                complaints_good: action.payload,
            });
        case GETCOMPLAIINTSCOURIERS:
            return Object.assign({}, state, {                
                complaints_couriers: action.payload,
            });
        case  GETCOURIERS:            
            return Object.assign({}, state, {                
                couriers: action.payload,
            });
        default:
            return state;
    }
}
