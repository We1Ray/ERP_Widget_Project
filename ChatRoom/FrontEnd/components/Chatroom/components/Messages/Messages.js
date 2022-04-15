import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Message from "../Message/Message";

import "./Messages.css";

const Messages = ({ messages, user }) => (
  <ScrollToBottom className="messages">
    {user ? (
      messages.map((message, i) => (
        <div key={i}>
          <Message message={message} user={user} />
        </div>
      ))
    ) : (
      <></>
    )}
  </ScrollToBottom>
);

export default Messages;
