/* @flow  */
import { handleActions } from 'redux-actions';
import {
  RESET_ERROR_MESSAGE,
  LOGIN_SUCCESSFUL,
  LOGIN_FAILED,
} from '../constants/ActionTypes';

const loginFailed = () => {
  return 'Login failed.';
};

const reset = () => {
  return null;
};

/* $FlowFixMe - computed keys not supported by flow yet */
export const errorMessageReducer = handleActions({
  [RESET_ERROR_MESSAGE]: reset,
  [LOGIN_SUCCESSFUL]: reset,
  [LOGIN_FAILED]: loginFailed,
}, {});
