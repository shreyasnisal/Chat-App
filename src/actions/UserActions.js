import * as types from './action-types';
import axios from 'axios';
import { AsyncStorage } from 'react-native';

export const getConversations = (user) => {
    return async dispatch => {
        axios({
            method: 'get',
            url: 'http://192.168.137.1:8093/chatapp/getConversations',
            params: {user: user},
        }).then(response => {
            if (response) {
                if (response.data) {
                    dispatch({ type: types.GET_CONVERSATIONS_SUCCESS, updatePayload: response });
                } else {
                    dispatch({ type: types.GET_CONVERSATIONS_FAILURE, updatePayload: response });
                }
            }
        }).catch(error => {
            alert("Network Error");
        })
    }
}

export const getChat = (user, target) => {
  return async dispatch => {
      axios({
          method: 'get',
          url: 'http://192.168.137.1:8093/chatapp/getChat',
          params: {user: user, target: target},
      }).then(response => {
          if (response) {
              if (response.data) {
                  dispatch({ type: types.GET_CHAT_SUCCESS, updatePayload: response });
              } else {
                  dispatch({ type: types.GET_CHAT_FAILURE, updatePayload: response });
              }
          }
      }).catch(error => {
          alert("Network Error");
      })
  }
}

export const addMessage = (data) => {
  data = JSON.stringify(data);
  return async dispatch => {
      axios({
          method: 'post',
          url: 'http://192.168.137.1:8093/chatapp/addMessage',
          params: {message: data},
      }).then(response => {
          if (response) {
              if (response.data) {
                  dispatch({ type: types.ADD_MESSAGE_SUCCESS, updatePayload: response });
              } else {
                  dispatch({ type: types.ADD_MESSAGE_FAILURE, updatePayload: response });
              }
          }
      }).catch(error => {
          alert("Network Error");
      })
  }
}
