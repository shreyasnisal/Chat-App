import * as types from './action-types';
import axios from 'axios';
import { AsyncStorage } from 'react-native';

export const addUser = (data) => {
    data=JSON.stringify(data);
    return async dispatch => {
        axios({
            method: 'post',
            url: 'http://192.168.137.1:8093/chatapp/addUser',
            params: {data: data},
        }).then(response => {
            if (response) {
                console.log (response);
                if (response.data) {
                    dispatch({ type: types.SIGNUP_SUCCESS, updatePayload: response });
                } else {
                    dispatch({ type: types.SIGNUP_FAILURE, updatePayload: response });
                }
            }
        }).catch(error => {
            alert("Network Error");
        })
    }
}
