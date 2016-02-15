// import 'babel-core/polyfill';
import React from 'react';
import { render } from 'react-dom';
import Root from './container/Root';
import configureStore from './store/configureStore';
import initialState from './data/stub';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
const store = configureStore(initialState);

render(
  <Root store={store} />,
  document.getElementById('app')
);
