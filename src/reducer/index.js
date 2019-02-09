import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer';
import SignupReducer from './SignupReducer';
import UserReducer from './UserReducer';

const appReducer = combineReducers({
    LoginReducer,
    SignupReducer,
    UserReducer
});

const rootReducer = (state, action) => {
    return appReducer(state, action)
  }

export default rootReducer;
