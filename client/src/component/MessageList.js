/* @flow  */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Message from '../component/Message';

const propTypes = {
  channelMessages: PropTypes.object.isRequired,
};

class MessageList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const { channelMessages: { messages } } = this.props;
    if (messages.length > 0) {
      const node = ReactDOM.findDOMNode(this.refs.messages);
      node.scrollTop = node.scrollHeight;
    }
  }

  render() {
    const { channelMessages: { messages } } = this.props;
    let lastSender;
    const msg = messages.map(message => {
      const sameSender = message.sender === lastSender;
      lastSender = message.sender;
      return (
        <Message
          sameSender={sameSender}
          {...message}
          {...this.props}
          />
      );
    });
    return (
      <div className="MessageList" ref="messages">
        {msg}
      </div>
    );
  }
}

MessageList.propTypes = propTypes;

export default MessageList;
