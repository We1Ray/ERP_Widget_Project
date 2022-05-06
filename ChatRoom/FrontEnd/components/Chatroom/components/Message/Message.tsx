import React, { useContext, useEffect, useState } from "react";
import ReactEmoji from "react-emoji";
import {
  CallApi,
  CENTER_FACTORY,
  None,
  SystemContext,
} from "../../../../resource";
import "./Message.css";
import { messageProps, userProps, usersProps } from "../Chat/Chat";

interface Props {
  message: messageProps;
  user: userProps;
  users: usersProps[];
}

const Message: React.FC<Props> = ({ message, user, users }) => {
  const ENDPOINT = "http://10.1.50.59:81";
  const { System } = useContext(SystemContext);
  const [isRead, setIsRead] = useState(
    message ? parseInt(message.isread) > 0 : false
  );
  let isSentByCurrentUser = false;

  if (message.send_member_name === user.name) {
    isSentByCurrentUser = true;
  }

  useEffect(() => {
    console.log(users);
    if (users.length > 1 && users[0].room.is_group === "N") {
      setIsRead(true);
    } else {
      CallApi.ExecuteApi(CENTER_FACTORY, ENDPOINT + "/chat/get_message_state", {
        room_id: message.room_id,
        message_id: message.message_id,
      })
        .then((res) => {
          if (res.status !== 200) {
            console.log(res);
          } else {
            setIsRead(parseInt(res.data[0].isread) > 0);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_message_state");
          console.log(error);
        });
    }
  }, [JSON.stringify(users)]);

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {isRead ? (
          <>
            {System.getLocalization("CHAT", "READ")}
            <br />
          </>
        ) : (
          <None />
        )}
        {message.hm}
      </p>
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
      <p
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {message.hm}
      </p>
    </div>
  );
};

export default Message;
