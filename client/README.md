# scalack

Scala based chat app. Web app written using React, Redux and ES6.

Based on yeoman generator https://github.com/newtriks/generator-react-webpack

# Usage
The following commands are available:

```javascript
# Start for development
npm start # or
npm run serve

# Start the dev-server with the dist version
npm run serve:dist

# Just build the dist version and copy static files
npm run dist

# Run unit tests
npm test

# Lint all files in src (also automatically done AFTER tests are run)
npm run lint

# Clean up the dist directory
npm run clean

# Just copy the static assets
npm run copy
```

# Libraries

## Runtime

- [redux](https://github.com/rackt/redux/) - Predictable state container for JavaScript based on Flux pattern.  
- [reselect](https://github.com/rackt/reselect) - Selector library for redux.
- [redux-router](https://github.com/rackt/redux-router) - Redux bindings for React Router
- [redux-thunk](https://github.com/gaearon/redux-thunk) - Asynchronous actions for Redux.
- [immupdate](https://github.com/AlexGalays/immupdate) - Immutable updates for JS Objects and Arrays. Used for state in stores.

## Testing

- [karma](http://karma-runner.github.io/) - a test runner that works on devices and in headless mode via PhantomJS.
- [mocha](https://mochajs.org/) - a test framework that supports any style of assertion library.
- [chai](http://chaijs.com/) - an assertion library that supports should, expect and assert styles.
- [React TestUtils](https://facebook.github.io/react/docs/test-utils.html) - help methods for testing React components.

# Glossary

- __channel__ - Somewhere to post messages. Can be private one-to-one, private group, or public. All users can see all public channels and may join them if they wish. Private ones are initiated with peers. In initial version, there is no api for joining channels, so list is hard coded.
- __contact__ - Someone you can send messages to.