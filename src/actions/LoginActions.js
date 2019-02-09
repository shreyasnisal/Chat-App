import * as types from './action-types';
import axios from 'axios';
import { AsyncStorage } from 'react-native';

export const validate = (data) => {
    data=JSON.stringify(data);
    return async dispatch => {
        axios({
            method: 'get',
            url: 'http://192.168.137.1:8093/chatapp/validate',
            params: {data: data},
        }).then(response => {
            if (response) {
                if (response.data) {
                    dispatch({ type: types.LOGIN_SUCCESS, updatePayload: response });
                } else {
                    dispatch({ type: types.LOGIN_FAILURE, updatePayload: response });
                }
            }
        }).catch(error => {
            alert("Network Error");
        })
    }
}
