import { websocketService } from './websocketService';

const serverDispatcher = store => next => action => {  // eslint-disable-line no-unused-vars
  if (action && action.meta && action.meta.toServer) {
    websocketService.send(action);
  }
  return next(action);
};

export default serverDispatcher;
