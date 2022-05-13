import React from "react";
import InputEmoji from "react-input-emoji";
import "./Input.css";

const Input = ({ message, setMessage, sendMessage }) => (
  <form className="form">
    {/* <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={(event) => setMessage(event.target.value)}
      onKeyPress={(event) =>
        event.key === "Enter" ? sendMessage(event) : null
      }
    /> */}
    <InputEmoji
      value={message}
      onChange={(event) => {
        setMessage(event);
      }}
      cleanOnEnter
      onEnter={sendMessage}
      placeholder="Type a message"
    />
    <button className="sendButton" onClick={(event) => sendMessage(event)}>
      Send
    </button>
  </form>
);

export default Input;
