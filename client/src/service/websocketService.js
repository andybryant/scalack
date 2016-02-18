/* @flow  */
import { log } from '../util';
import config from 'config';
import type { WebsocketService} from '../typ/services';

function websocketServiceCreator(): WebsocketService {
  const pendingActions = [];
  let websocket;
  const response = {
    connect(messageCallback) {
      const socket = websocket = new WebSocket(config.wsUrl); // eslint-disable-line new-cap

      socket.onopen = () => {
        pendingActions.forEach(action => {
          log.debug('Sending', action);
          socket.send(JSON.stringify(action));
        });
      };

      socket.onmessage = event => {
        const action = event.data;
        log.debug('Received', action);
        messageCallback(action, response.send);
      };

      socket.onerror = event => {
        log.error('websocket error', event);
        messageCallback(event, response.send);
      };
    },
    status() {
      return websocket && websocket.readyState;
    },
    send(action) {
      if (websocket && websocket.readyState === websocket.OPEN) {
        websocket.send(JSON.stringify(action));
      } else {
        pendingActions.unshift(action);
      }
    },
  };

  return response;
}

export const websocketService = websocketServiceCreator();
