import React from "react";
import "./Message.css";
import ReactEmoji from "react-emoji";
//passed in a message and name from messages.js
//message is an object that contains user and text
//user is the sender of the message and the text is the body of the msg
const Message = ({ message, user }) => {
  let isSentByCurrentUser = false;
  //if true we render a blue message on the right side as it is sent by the current user
  if (message.send_member_name === user.name) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p>{message.create_date}</p>
      &emsp;
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">
          {ReactEmoji.emojify(message.message_content)}
        </p>
      </div>
      &emsp;
      {/* <p className="sentText pr-12">{user.name}</p> */}
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <p className="sentText pl-10">{message.send_member_name}</p>
      &emsp;
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">
          {ReactEmoji.emojify(message.message_content)}
        </p>
      </div>
      &emsp;
      <p>{message.create_date}</p>
    </div>
  );
};

export default Message;
