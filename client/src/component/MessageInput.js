/* @flow  */
import React, { Component, PropTypes } from 'react';
import { TextField } from 'material-ui/lib';
import * as Mousetrap from 'mousetrap';

const propTypes = {
  params: PropTypes.object.isRequired,
  postMessage: PropTypes.func.isRequired,
  editLastMessage: PropTypes.func.isRequired,
};

class MessageInput extends Component {
  constructor(props: any) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.focusOnInput = this.focusOnInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.state = {
      message: '',
    };
    this.mousetrap = new Mousetrap.default(); // eslint-disable-line new-cap
  }

  componentWillMount() {
    this.mousetrap
      .bind('/', () => { this.focusOnInput(); return false; });
  }

  onKeyDown(evt: any) {
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

  handleChange(event: any) {
    const message = event.target.value;
    this.setState({ message });
  }

  handleSendMessage(event: any) {
    const { postMessage, params: { channelId } } = this.props;
    postMessage(channelId, event.target.value);
    this.setState({ message: ''});
  }

  render(): any {
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
