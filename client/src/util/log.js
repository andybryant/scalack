if (process.env.NODE_ENV === 'production') {
  module.exports = require('./log.prod');
} else {
  module.exports = require('./log.dev');
}
