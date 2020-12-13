import { SET_CELLS, SET_FAVORITES } from '../../utils/contants';

const initialState = {
    filter: null,
    marks: [],
    favorites: [],
};

export function cellsReducer(state = initialState, action) {
    if (action.type === SET_CELLS) {
        return Object.assign({}, state, {
            filter: action.payload.filter,
            marks: action.payload.data || [],
        });
    }

    if (action.type === SET_FAVORITES) {
        return Object.assign({}, state, {
            favorites: action.payload.data || [],
        });
    }

    if (!state) {
        state = {
            filter: null,
            marks: [],
        };
    }
    return state;
}
