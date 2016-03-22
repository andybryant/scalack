/* @flow  */
import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import { authReducer as auth } from './authReducer';
import { entityReducer as entities } from './entityReducer';
import { errorMessageReducer as errorMessage } from './errorMessageReducer';
import { presenceReducer as presence } from './presenceReducer';

const rootReducer = combineReducers({
  router,
  auth,
  entities,
  errorMessage,
  presence,
});

export default rootReducer;
