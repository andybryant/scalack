/* @flow  */
const log = {
  debug(...args: Array<any>) {
    console.debug(...args); // eslint-disable-line no-console
  },
  info(...args: Array<any>) {
    console.info(...args); // eslint-disable-line no-console
  },
  warn(...args: Array<any>) {
    console.warn(...args); // eslint-disable-line no-console
  },
  error(...args: Array<any>) {
    console.error(...args); // eslint-disable-line no-console
  },
  log(...args: Array<any>) {
    console.log(...args); // eslint-disable-line no-console
  },
};

export default log;
