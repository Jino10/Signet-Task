import { combineReducers } from 'redux';
import UserReducer from './UserReducers';

const rootReducer = combineReducers({
  UserReducer,
});

export default rootReducer;
