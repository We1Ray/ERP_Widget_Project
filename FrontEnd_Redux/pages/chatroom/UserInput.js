import React, { Component, PropTypes } from "react";

export default class UserInput extends Component {
  static propTypes = {
    messageChange: Function,
    handleKeyDown: Function,
    newMessage: String,
  };

  render() {
    const { newMessage, messageChange, handleKeyDown } = this.props;
    return (
      <input
        className="new-message"
        value={newMessage}
        onChange={messageChange}
        onKeyDown={handleKeyDown}
      />
    );
  }
}
