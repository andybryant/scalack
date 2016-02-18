// import 'babel-core/polyfill';
import React from 'react';
import { render } from 'react-dom';
import Root from './container/Root';
import configureStore from './store/configureStore';
import initialState from './data/stub';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { log } from './util';

injectTapEventPlugin();
const store = configureStore(initialState);
log.info('Created store', store);

render(
  <Root store={store} />,
  document.getElementById('app')
);
