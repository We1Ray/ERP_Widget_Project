import React, { useContext, useEffect, useRef, useState } from "react";
import {
  CallApi,
  CENTER_FACTORY,
  None,
  SystemContext,
} from "../../../../resource";
import "./Message.css";
import {
  messageProps,
  userProps,
  usersProps,
  fileMessageProps,
} from "../Chat/Chat";

interface Props {
  message: messageProps;
  user: userProps;
  users: usersProps[];
  searchedMessage?: messageProps;
  searchedMessagesList?: messageProps[];
}

const Message: React.FC<Props> = ({
  message,
  user,
  users,
  searchedMessage,
  searchedMessagesList,
}) => {
  const ENDPOINT = "http://localhost:81";
  const { System } = useContext(SystemContext);
  const [isRead, setIsRead] = useState(
    message ? parseInt(message.isread) > 0 : false
  );
  const [isSentByCurrentUser, setIsSentByCurrentUser] = useState(false);
  const [messageClassType, setMessageClassType] = useState({});
  const [file, setFile] = useState<fileMessageProps>(null);
  const [isImage, setIsImage] = useState(false);

  const messageRef = useRef(null);

  useEffect(() => {
    if (message.send_member === user.account_uid) {
      setIsSentByCurrentUser(true);
    }
  }, [JSON.stringify(message), JSON.stringify(user)]);

  useEffect(() => {
    if (searchedMessage) {
      if (message.message_id === searchedMessage.message_id) {
        setMessageClassType({
          backgroundColor: "red",
          color: "white",
        });
        messageRef.current.scrollIntoView(); /** 設定scrollbar至被查詢的訊息 */
      } else if (
        searchedMessagesList.find(
          (element) => element.message_id === message.message_id
        )
      ) {
        setMessageClassType({
          backgroundColor: "orange",
          color: "white",
        });
      } else {
        if (isSentByCurrentUser) {
          setMessageClassType({
            color: "white",
          });
        } else {
          setMessageClassType({
            color: "#353535",
          });
        }
      }
    } else {
      if (isSentByCurrentUser) {
        setMessageClassType({
          color: "white",
        });
      } else {
        setMessageClassType({
          color: "#353535",
        });
      }
    }
  }, [
    JSON.stringify(message),
    JSON.stringify(searchedMessage),
    isSentByCurrentUser,
  ]);

  const TRANSPARENT_GIF =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  function getAllEmojisFromText(text) {
    return text.match(
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g
    );
  }

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  }

  function replaceAllTextEmojis(text) {
    let allEmojis = getAllEmojisFromText(text);

    // TODO: get all emoji style
    const allEmojiStyle = {};

    if (allEmojis) {
      allEmojis = Array.from(new Set(allEmojis));

      allEmojis.forEach((emoji: string | number) => {
        const style = allEmojiStyle[emoji];

        if (!style) return;

        text = replaceAll(
          text,
          emoji,
          `<img
              style="${style}"
              data-emoji="${emoji}"
              src="${TRANSPARENT_GIF}"
            />`
        );
      });
    }

    return text;
  }

  useEffect(() => {
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

  useEffect(() => {
    if (message.file_id) {
      CallApi.ExecuteApi(CENTER_FACTORY, ENDPOINT + "/file/get_file", {
        file_id: message.file_id,
      })
        .then((res) => {
          if (res.status === 200) {
            setFile(res.data[0]);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /file/get_file");
          console.log(error);
        });

      if (message.message_type.indexOf("image") > -1) {
        setIsImage(true);
      } else {
        setIsImage(false);
      }
    }
  }, [JSON.stringify(message)]);

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd" ref={messageRef}>
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
      {file ? (
        <div className="messageBox backgroundBlue">
          <a
            className="messageText fileMessage"
            style={messageClassType}
            href={file.url + "/download"}
            download={file.name}
          >
            <i className="fas fa-file" />
            &ensp;
            {replaceAllTextEmojis(message.message_content)}
          </a>
        </div>
      ) : (
        <div className="messageBox backgroundBlue">
          <p className={"messageText"} style={messageClassType}>
            {replaceAllTextEmojis(message.message_content)}
          </p>
        </div>
      )}
      &emsp;
    </div>
  ) : (
    <div className="messageContainer justifyStart" ref={messageRef}>
      <p className="sentText pl-10">{message.send_member_name}</p>
      &emsp;
      {file ? (
        <div className="messageBox backgroundLight">
          <a
            className="messageText"
            style={messageClassType}
            href={file.url + "/download"}
            download={file.name}
          >
            {replaceAllTextEmojis(message.message_content)}
          </a>
        </div>
      ) : (
        <div className="messageBox backgroundLight">
          <p className={"messageText"} style={messageClassType}>
            {replaceAllTextEmojis(message.message_content)}
          </p>
        </div>
      )}
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
