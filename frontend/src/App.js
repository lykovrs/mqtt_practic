import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { subscribeToMessage, sendMessage } from "./api";

class App extends Component {
  state = {
    messages: [],
    value: "",
  };

  constructor(props) {
    super(props);
    subscribeToMessage((err, message) => {
      this.setState({
        messages: [...this.state.messages, message],
      });
    });
  }

  getMessages = () =>
    this.state.messages.map((message, i) => <li key={i}>{message}</li>);

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <ul id="messages">{this.getMessages()}</ul>
          <form onSubmit={this.handleSubmit}>
            Send data on <code>MQTT</code>.
            <input
              onChange={this.handleChange}
              type="text"
              value={this.state.value}
              placeholder={"write value"}
            />
            <button type={"submit"}>Send</button>
          </form>
        </div>
      </div>
    );
  }

  handleSubmit = e => {
    e.preventDefault();
    sendMessage(this.state.value);
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };
}

export default App;
