import * as types from '../actions/action-types';

export default (state = [], action) => {
    switch (action.type) {
        case types.LOGIN_SUCCESS:
            return {
                ...state,
                loginSuccess: action.updatePayload.data
            };
        case types.LOGIN_FAILURE:
            return {
                ...state,
                loginFailure: action.updatePayload.data
            };
        default:
            return state;
    }
};
