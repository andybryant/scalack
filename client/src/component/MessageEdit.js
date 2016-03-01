/* @flow  */
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { FlatButton, TextField } from 'material-ui/lib';
import { gotoChannel } from '../util/navigation';

const propTypes = {
  channelId: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  timestamp: PropTypes.number,
  sender: PropTypes.string,
  deleteMessage: PropTypes.func.isRequired,
  updateMessage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

class MessageEdit extends Component {
  constructor(props) {
    super(props);
    const { text } = this.props;
    this.state = {
      message: text,
    };
    this.onSave = this.onSave.bind(this);
    this.onRevert = this.onRevert.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.refs.messageField.focus();
  }

  onSave(): void {
    const { updateMessage, deleteMessage, channelId, messageId, history } = this.props;
    const text = this.state.message;
    if (text) {
      updateMessage(channelId, messageId, text);
    } else {
      deleteMessage(channelId, messageId);
    }
    gotoChannel(history, channelId);
  }

  onRevert(): void {
    const { history, channelId } = this.props;
    gotoChannel(history, channelId);
  }

  onKeyDown(evt:any) {
    const { channelId, history } = this.props;
    if (evt.keyCode === 27) { // escape
      evt.preventDefault();
      gotoChannel(history, channelId);
    }
  }


  handleChange(event) {
    const message = event.target.value;
    this.setState({ message });
  }

  render(): any {
    const { message } = this.state;
    const messageClasses = classnames(
      'MessageEdit',
    );
    return (
      <div className={messageClasses}>
        <TextField
          className="message-input"
          ref="messageField"
          hintText="New message"
          fullWidth
          onKeyDown={this.onKeyDown}
          onChange={this.handleChange}
          onEnterKeyDown={this.onSave}
          value={message}
          />
        <FlatButton onTouchTap={this.onRevert} className="cancel" label="Cancel" />
        <FlatButton onTouchTap={this.onSave} className="save" label={ message ? 'Save' : 'Delete'} primary />
      </div>
    );
  }
}

MessageEdit.propTypes = propTypes;

export default MessageEdit;
