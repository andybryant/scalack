/* @flow  */
import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';

export const resetErrorMessage = createAction(types.RESET_ERROR_MESSAGE);

export {
  login,
  logout,
} from './authActions';

export {
  postMessage,
  updateMessage,
  deleteMessage,
} from './messageActions';

