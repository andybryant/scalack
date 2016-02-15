/* @flow  */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { channelSelector } from '../selector';
import * as actions from '../action';
import {
  TextField,
} from 'material-ui/lib';

const propTypes = {
  routeParams: PropTypes.object.isRequired,
  entities: PropTypes.object.isRequired,
  channels: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  wsService: PropTypes.object.isRequired,
};

class ChannelPage extends Component {
  constructor(props) {
    super(props);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  handleSendMessage(event) {
    const { wsService, params: { channelId } } = this.props;
    wsService.send({
      type: 'postMessage',
      payload: {
        clientMessageId: '444',
        channelId,
        text: event.target.value,
      },
    });
  }

  render() {
    const { channels, params: { channelId }, messages } = this.props;
    const channel = channels.find(ch => ch.id === channelId);
    const channelMessages = messages[channelId];
    const msg = channelMessages.map(message => <div key={message.id}>{message.text}</div>);
    return (
      <div className="ChannelPage container">
        <h2>{channel.private ? 'Private' : channel.name}</h2>
        <div>
          {msg}
        </div>
      <TextField ref="messageField" hintText="New message" onEnterKeyDown={this.handleSendMessage} />
      </div>
    );
  }
}

ChannelPage.propTypes = propTypes;

export default connect(channelSelector, actions)(ChannelPage);
