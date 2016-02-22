/* @flow  */
import React, { Component, PropTypes } from 'react';
import MDReactComponent from 'markdown-react-js';
import moment from 'moment';

const propTypes = {
  text: PropTypes.string.isRequired,
  timestamp: PropTypes.number,
  sender: PropTypes.string,
};

class Message extends Component {
  constructor(props) {
    super(props);
  }

  render(): any {
    const { text, timestamp, sender } = this.props;
    return (
      <div className="Message">
        <div className="sender">{sender}</div>
        <div className="timestamp">{ moment(timestamp).format('LT') }</div>
        <div className="text"><MDReactComponent text={text} /></div>
      </div>
    );
  }
}

Message.propTypes = propTypes;

export default Message;
