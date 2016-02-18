import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import routes from '../routes';
import websocketMiddleware from '../service/websocketMiddleware';
import thunk from 'redux-thunk';
import rootReducer from '../reducer';

const finalCreateStore = compose(
  applyMiddleware(thunk),
  applyMiddleware(websocketMiddleware),
  reduxReactRouter({ routes, createHistory })
)(createStore);

export default function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState);
}
