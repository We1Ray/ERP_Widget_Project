import React, { useContext, useEffect, useRef, useState } from "react";
import {
  CallApi,
  CENTER_FACTORY,
  None,
  SystemContext,
  Row,
  Column,
  DraggableDialog,
} from "../../../../resource";
import "./Message.css";
import {
  messageProps,
  userProps,
  usersProps,
  fileMessageProps,
} from "../Chat/Chat";
import Crypto from "crypto-js";
import { Button, DialogActions } from "@material-ui/core";

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
  // const [isSentByCurrentUser, setIsSentByCurrentUser] = useState(false);
  const [messageClassType, setMessageClassType] = useState({});
  const [file, setFile] = useState<fileMessageProps>(null);
  const [isImage, setIsImage] = useState(false);
  const [dialogOn, setDialogOn] = useState(false);

  const messageRef = useRef(null);

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
        if (message.send_member === user.account_uid) {
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
      if (message.send_member === user.account_uid) {
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
    JSON.stringify(user),
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
    if (message.message_type !== "string") {
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

      if (message.message_type) {
        if (message.message_type.indexOf("image") > -1) {
          setIsImage(true);
        } else {
          setIsImage(false);
        }
      } else {
        setIsImage(false);
      }
    } else {
      setFile(null);
    }
  }, [JSON.stringify(message)]);

  return message.send_member === user.account_uid ? (
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
        isImage ? (
          <>
            <img
              src={file.url + "/download"}
              alt={file.name}
              style={{
                backgroundColor: "black",
                height: "100px",
                width: "100px",
                cursor: "pointer",
              }}
              onClick={(e) => setDialogOn(true)}
            />

            <DraggableDialog open={dialogOn}>
              <DialogActions>
                <Button
                  onClick={() => setDialogOn(false)}
                  style={{
                    backgroundColor: "rgb(171, 219, 241)",
                  }}
                >
                  <i className="fas fa-times" />
                </Button>
              </DialogActions>
              <img
                src={file.url + "/download"}
                alt={file.name}
                style={{
                  backgroundColor: "black",
                }}
              />
            </DraggableDialog>
          </>
        ) : (
          <div className="messageBox backgroundBlue">
            <a
              className="messageText fileMessage"
              style={messageClassType}
              href={file.url + "/download"}
              download={file.name}
            >
              <Column>
                <Row>
                  <i className="fas fa-file-alt" style={{ fontSize: "20px" }} />
                  &ensp;
                  {replaceAllTextEmojis(message.message_content)}
                </Row>
                <Row>
                  <p>
                    {System.getLocalization("CHAT", "FILE_SIZE")} &nbsp;{" "}
                    {file.size > 1024
                      ? file.size > 1048576
                        ? file.size > 1073741824
                          ? Math.round(file.size / 1073741824) + "GB"
                          : Math.round(file.size / 1048576) + "MB"
                        : Math.round(file.size / 1024) + "KB"
                      : file.size + "B"}
                  </p>
                </Row>
              </Column>
            </a>
          </div>
        )
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
        isImage ? (
          <>
            <img
              src={file.url + "/download"}
              alt={file.name}
              style={{
                backgroundColor: "black",
                height: "100px",
                width: "100px",
                cursor: "pointer",
              }}
              onClick={(e) => setDialogOn(true)}
            />

            <DraggableDialog open={dialogOn}>
              <DialogActions>
                <Button
                  onClick={() => setDialogOn(false)}
                  style={{
                    backgroundColor: "rgb(171, 219, 241)",
                  }}
                >
                  <i className="fas fa-times" />
                </Button>
              </DialogActions>
              <img
                src={file.url + "/download"}
                alt={file.name}
                style={{
                  backgroundColor: "black",
                }}
              />
            </DraggableDialog>
          </>
        ) : (
          <div className="messageBox backgroundLight">
            <a
              className="messageText fileMessage"
              style={messageClassType}
              href={file.url + "/download"}
              download={file.name}
            >
              <i className="fas fa-file-alt" />
              &ensp;
              {replaceAllTextEmojis(message.message_content)}
            </a>
          </div>
        )
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
