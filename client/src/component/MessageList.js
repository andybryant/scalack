/* @flow  */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Message from '../component/Message';
import moment from 'moment';

const propTypes = {
  channelMessages: PropTypes.object.isRequired,
};

class MessageList extends Component {
  constructor(props: any) {
    super(props);
  }

  componentDidUpdate() {
    const { channelMessages: { messages } } = this.props;
    if (messages.length > 0) {
      const node = ReactDOM.findDOMNode(this.refs.messages);
      node.scrollTop = node.scrollHeight;
    }
  }

  render(): any {
    const { channelMessages: { messages } } = this.props;
    let lastSender;
    let lastDate;
    const msgs = messages.map(message => {
      const sameDay = lastDate && moment(message.timestamp).isSame(lastDate, 'day');
      const sameSender = message.sender === lastSender;
      const header = sameDay ? null : (
        <div className="header">{ moment(message.timestamp).format('dddd, MMMM Do YYYY') }</div>
      );
      lastSender = message.sender;
      lastDate = message.timestamp;
      return (
        <div>
          {header}
          <Message
            sameSender={sameSender}
            {...message}
            {...this.props}
            />
        </div>
      );
    });
    return (
      <div className="MessageList" ref="messages">
        {msgs}
      </div>
    );
  }
}

MessageList.propTypes = propTypes;

export default MessageList;
