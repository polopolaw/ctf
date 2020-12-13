import {
    SET_COMMENTS,
    SET_SELECTED_MARKS,
    UPDATE_LIKED_MARK,
    UPDATE_SELECTED_MARKS,
    SET_NEW_COMMENT,
} from '../../utils/contants';

const initialState = {
    x: -1,
    y: -1,
    marks: [],
};

export function selectedReducer(state = initialState, action) {
    if (action.type === SET_SELECTED_MARKS) {
        return Object.assign({}, state, {
            x: action.payload.cell.x,
            y: action.payload.cell.y,
            marks: action.payload.marks || [],
        });
    }

    if (action.type === UPDATE_SELECTED_MARKS) {
        let mark = action.payload.data;
        if (mark && mark.x === state.x && mark.y === state.y) {
            return Object.assign({}, state, {
                marks: (state.marks || []).concat([mark]),
            });
        }
    }

    if (action.type === UPDATE_LIKED_MARK) {
        const likedMark = action.payload.data;

        const allMarks = state.marks;

        const index = allMarks.findIndex(mark => mark.id === likedMark.id);

        if (index > -1) {
            allMarks[index] = likedMark;
        }

        return Object.assign({}, state, {
            marks: allMarks.slice(),
        });
    }

    if (action.type === SET_COMMENTS) {
        const markId = action.payload.markId;
        const allMarks = state.marks;
        const index = allMarks.findIndex(mark => mark.id === markId);
        if (index > -1) {
            allMarks[index].commentsData = action.payload.data || [];

            return Object.assign({}, state, {
                marks: allMarks.slice(),
            });
        }
    }

    if (action.type === SET_NEW_COMMENT) {
        const markId = action.payload.markId;
        const allMarks = state.marks;
        const index = allMarks.findIndex(mark => mark.id === markId);
        if (index > -1) {
            let mark = allMarks[index];
            let commentsData = mark.commentsData || [];
            commentsData.push(action.payload.data);
            mark.comments = mark.comments + 1;
            mark.commentsData = commentsData;

            return Object.assign({}, state, {
                marks: allMarks.slice(),
            });
        }
    }

    if (!state) {
        state = {
            x: -1,
            y: -1,
            marks: [],
        };
    }
    return state;
}
