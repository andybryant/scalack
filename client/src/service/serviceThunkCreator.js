/* @flow  */
import { log } from '../util';
import { createAction } from 'redux-actions';

export default function thunkCreator(dispatch: any): any {
  const errorCreator = createAction('error');
  return (actionJson, send) => {
    const action = JSON.parse(actionJson);
    log.debug('Received', action);
    const type = action.type;
    switch (type) {
    case 'loginSuccessful':
      send({type: 'channels'});
      send({type: 'users'});
      dispatch(action);
      break;
    case 'loginFailed':
      dispatch(action);
      break;
    case 'channels':
    case 'users':
    case 'messageHistory':
    case 'publishMessage':
      dispatch(action);
      break;
    default:
      const err = new Error('Unknown action ' + actionJson);
      dispatch(errorCreator(err));
      break;
    }
  };
}
