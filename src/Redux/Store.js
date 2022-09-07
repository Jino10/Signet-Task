import { createStore } from 'redux';

import RootReducers from './Reducers/RootReducers';

const store = createStore(RootReducers);

export default store;
