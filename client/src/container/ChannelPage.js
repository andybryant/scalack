/* @flow  */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { channelSelector } from '../selector';
import * as actions from '../action';
import Message from '../component/Message';
import {
  TextField,
} from 'material-ui/lib';
import * as Mousetrap from 'mousetrap';
import { gotoEditMessage } from '../util/navigation';

const propTypes = {
  channels: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  channelMessages: PropTypes.object.isRequired,
  postMessage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

class ChannelPage extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleEditLastMessage = this.handleEditLastMessage.bind(this);
    this.state = {
      message: '',
    };
    this.mousetrap = new Mousetrap.default(); // eslint-disable-line new-cap
  }

  componentWillMount() {
    this.mousetrap
      .bind('up', () => { this.handleEditLastMessage(); });
  }

  componentDidUpdate() {
    const { channelMessages: { messages } } = this.props;
    if (messages.length > 0) {
      const node = ReactDOM.findDOMNode(this.refs.messages);
      node.scrollTop = node.scrollHeight;
    }
  }

  handleEditLastMessage() {
    const { userId, channelMessages: { messages }, history } = this.props;
    const lastMessage = messages.reverse().find(message => message.senderId === userId);
    if (lastMessage) {
      const { messageId, channelId } = lastMessage;
      gotoEditMessage(history, channelId, messageId);
    }
  }

  handleChange(event) {
    const message = event.target.value;
    this.setState({ message });
  }

  handleSendMessage(event) {
    const { postMessage, params: { channelId } } = this.props;
    postMessage(channelId, event.target.value);
    this.setState({ message: ''});
  }

  render() {
    const { channels, channelMessages: { messages }, params: { channelId } } = this.props;
    const channel = channels.find(ch => ch.id === channelId);
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
      <div className="ChannelPage container">
        <div className="title">{channel.name ? channel.name : 'Private'}</div>
        <div className="messages" ref="messages">
          {msg}
        </div>
        <TextField
          className="message-input"
          ref="messageField"
          hintText="New message"
          fullWidth
          onChange={this.handleChange}
          onEnterKeyDown={this.handleSendMessage}
          value={this.state.message}
          />
      </div>
    );
  }
}

ChannelPage.propTypes = propTypes;

export default connect(channelSelector, actions)(ChannelPage);
