/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0*/
'use strict';

// Uncomment the following lines to use the react test utilities
// import React from 'react/addons';
// const TestUtils = React.addons.TestUtils;
import createComponent from 'helpers/shallowRenderHelper';
import Root from 'container/Root';

describe('RootComponent', () => {
  let RootComponent;

  beforeEach(() => {
    RootComponent = createComponent(Root);
  });

  it('should have its component name as default className', () => {
    expect(RootComponent.props.className).to.be.undefined;
  });
});
