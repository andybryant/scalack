import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import DevTools from '../container/DevTools';
import createHistory from 'history/lib/createBrowserHistory';
import routes from '../routes';
import websocketMiddleware from '../service/websocketMiddleware';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducer';

const finalCreateStore = compose(
  applyMiddleware(thunk),
  applyMiddleware(websocketMiddleware),
  reduxReactRouter({ routes, createHistory }),
  applyMiddleware(createLogger()),
  DevTools.instrument()
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducer', () => {
      const nextRootReducer = require('../reducer');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
