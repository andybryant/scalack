/* @flow  */
import { log } from '../util';

export default function websocketService(dispatch: any, url: string) {
  const socket = new WebSocket(url); // eslint-disable-line new-cap
  const pendingActions = [];

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: 'login', payload: { user: 'Bob', password: '123' }}));
    pendingActions.forEach(action => {
      log.debug('Sending', action);
      socket.send(JSON.stringify(action));
    });
  };

  socket.onmessage = event => {
    const action = JSON.parse(event.data);
    log.debug('Received', action);
    dispatch(action);
  };

  socket.onerror = event => {
    log.error('websocket error', event);
  };

  return {
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
}
