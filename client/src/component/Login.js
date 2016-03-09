/* @flow  */
import React, { Component, PropTypes } from 'react';
import { RaisedButton, TextField } from 'material-ui/lib';

const propTypes = {
  login: PropTypes.func.isRequired,
  userName: PropTypes.string,
  password: PropTypes.string,
};

class Login extends Component {

  constructor(props:any) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    this.refs.username.focus();
  }

  handleLogin() {
    const userName = this.refs.username.getValue();
    const password = this.refs.password.getValue();
    this.props.login(userName, password);
  }

  render():any {
    return (
      <div className="Login">
        <div className="username">
          <TextField ref="username"
            hintText="Username"
            />
        </div>
        <div className="password">
          <TextField ref="password"
            hintText="Password"
            onEnterKeyDown={this.handleLogin}
            type="password"
            />
        </div>
        <div className="login-button">
          <RaisedButton
            label="Login"
            primary
            onTouchTap={this.handleLogin}
            />
        </div>
      </div>
    );
  }
}

Login.propTypes = propTypes;

export default Login;
