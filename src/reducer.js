/* action types */

const SET_POST = "SET_POST"

/* initialize state */
const initialState = {aa:'aa'};

const postReducer = (state = initialState, action) => {
    switch (action.type)
    {
        case SET_POST: {
            return Object.assign({}, state, action.post);
        }
        default:
            return state;
    }
}

export function setPost(post) {
    return {
        type: SET_POST, 
        post
    }
};

export default postReducer