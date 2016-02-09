/* @flow  */
import { log } from '../util';

export default function websocketService(messageCallback: any, url: string) {
  const socket = new WebSocket(url); // eslint-disable-line new-cap
  const pendingActions = [];
  const response = {
    status() {
      return socket.readyState;
    },
    send(action) {
      if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify(action));
      } else {
        pendingActions.unshift(action);
      }
    },
  };

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

  return response;
}
