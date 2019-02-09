import * as types from '../actions/action-types';

export default (state = [], action) => {
    switch (action.type) {
        case types.SIGNUP_SUCCESS:
            return {
                ...state,
                signupSuccess: action.updatePayload.data
            };
        case types.SIGNUP_FAILURE:
            return {
                ...state,
                signupFailure: action.updatePayload.data
            };
        default:
            return state;
    }
};
