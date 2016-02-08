/* @flow  */
import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

import { authReducer as auth } from './authReducer';
import { entityReducer as entities } from './entityReducer';

const rootReducer = combineReducers({
  auth,
  router,
  entities,
});

export default rootReducer;
