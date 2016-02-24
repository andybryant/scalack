/* @flow  */
import React, { Component, PropTypes } from 'react';
import MDReactComponent from 'markdown-react-js';
import moment from 'moment';
import classnames from 'classnames';

const propTypes = {
  text: PropTypes.string.isRequired,
  timestamp: PropTypes.number,
  sender: PropTypes.string,
  sameSender: PropTypes.bool,
};

class Message extends Component {
  constructor(props) {
    super(props);
  }

  render(): any {
    const { text, timestamp, sender, sameSender } = this.props;
    const messageClasses = classnames(
      'Message',
      { 'same-sender': sameSender },
    );
    return (
      <div className={messageClasses}>
        <div className="sender">{sender}</div>
        <div className="timestamp">{ moment(timestamp).format('LT') }</div>
        <div className="text"><MDReactComponent text={text} /></div>
      </div>
    );
  }
}

Message.propTypes = propTypes;

export default Message;
