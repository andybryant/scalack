/* @flow  */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { channelSelector } from '../selector';
import * as actions from '../action';
import Message from '../component/Message';
import {
  TextField,
} from 'material-ui/lib';

const propTypes = {
  channels: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  channelMessages: PropTypes.object.isRequired,
  postMessage: PropTypes.func.isRequired,
};

class ChannelPage extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.state = {
      message: '',
    };
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
    const msg = messages.map(message => <Message {...message} />);
    return (
      <div className="ChannelPage container">
        <div className="title">{channel.name ? channel.name : 'Private'}</div>
        <div className="messages">
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
