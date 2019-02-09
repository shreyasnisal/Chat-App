import * as types from '../actions/action-types';

export default (state = [], action) => {
    switch (action.type) {
        case types.GET_CONVERSATIONS_SUCCESS:
            return {
                ...state,
                getConversationsSuccess: action.updatePayload.data
            };
        case types.GET_CONVERSATIONS_FAILURE:
            return {
                ...state,
                getConversationsFailure: action.updatePayload.data
            };
        case types.GET_CHAT_SUCCESS:
            return {
                ...state,
                getChatSuccess: action.updatePayload.data
          }
        case types.GET_CHAT_FAILURE:
            return {
                ...state,
                getChatFailure: action.updatePayload.data
            }
        case types.ADD_MESSAGE_SUCCESS:
            return {
                ...state,
                addMessageSuccess: action.updatePayload.data
            }
        case types.ADD_MESSAGE_FAILURE:
            return {
                ...state,
                addMessageFailure: action.updatePayload.data
            }
        default:
            return state;
    }
};
