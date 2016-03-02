/* @flow  */
import React, { Component, PropTypes } from 'react';
import { TextField } from 'material-ui/lib';

const propTypes = {
  params: PropTypes.object.isRequired,
  postMessage: PropTypes.func.isRequired,
  editLastMessage: PropTypes.func.isRequired,
};

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.focusOnInput = this.focusOnInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.state = {
      message: '',
    };
  }

  onKeyDown(evt:any) {
    if (evt.keyCode === 38 ) { // up
      if (!this.state.message) {
        evt.preventDefault();
        this.props.editLastMessage();
      }
    } else if (evt.keyCode === 27) { // escape
      evt.preventDefault();
      this.setState({ message: '' });
      document.activeElement.blur();
    }
  }

  focusOnInput() {
    this.refs.messageField.focus();
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
    return (
      <TextField
        className="message-input"
        ref="messageField"
        hintText="New message"
        fullWidth
        onKeyDown={this.onKeyDown}
        onChange={this.handleChange}
        onEnterKeyDown={this.handleSendMessage}
        value={this.state.message}
        />
    );
  }
}

MessageInput.propTypes = propTypes;

export default MessageInput;
