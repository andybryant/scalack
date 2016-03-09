/* @flow  */
import { log } from '../util';
import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';

const defaultMeta = {
  local: false,
  synced: true,
  toServer: false,
};

export default function thunkCreator(dispatch: any): any {
  const errorCreator = createAction('error');
  return (actionJson, send) => {
    const action = Object.assign({ meta: defaultMeta }, JSON.parse(actionJson));
    log.debug('Received', action);
    const type = action.type;
    switch (type) {
    case types.LOGIN_SUCCESSFUL:
      send({type: types.CHANNEL_SET});
      send({type: types.USER_SET});
      dispatch(action);
      break;
    case types.LOGIN_FAILED:
    case types.LOGOUT_SUCCESSFUL:
    case types.CHANNEL_SET:
    case types.USER_SET:
    case types.MESSAGE_HISTORY:
    case types.PUBLISH_MESSAGE:
    case types.UPDATE_MESSAGE:
    case types.DELETE_MESSAGE:
      dispatch(action);
      break;
    default:
      const err = new Error('Unknown action ' + actionJson);
      dispatch(errorCreator(err));
      break;
    }
  };
}
