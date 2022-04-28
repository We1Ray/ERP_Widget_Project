import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";

import Input from "../Input/Input";
import InfoBar from "../InfoBar/InfoBar";
import Messages from "../Messages/Messages";
// import TextContainer from "../TextContainer/TextContainer";

import {
  CallApi,
  CENTER_FACTORY,
  SystemContext,
} from "../../../../resource/index";
import "./Chat.css";

let socket = null;

interface Props {
  room: room;
}
interface room {
  room_id: string;
  is_group: string;
}

const Chat: React.FC<Props> = ({ room }) => {
  const { System } = useContext(SystemContext);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState("");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({
    data: [],
    isUserMessage: false,
  });
  const [messagesBottom, setMessagesBottom] = useState(true);
  const [newMsg, setNewMsg] = useState(null);

  const ENDPOINT = "http://10.1.50.59:81";

  useEffect(() => {
    CallApi.ExecuteApi(CENTER_FACTORY, ENDPOINT + "/chat/get_userInfo", {
      access_token: System.token,
    })
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data[0]);
          getMessages(false, "INIT", res.data[0]); //更新新訊息
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/get_userInfo");
        console.log(error);
      });
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT);
    if (user) {
      socket.emit(
        "join",
        { room: room.room_id, userInfo: user },
        (error: any) => {
          if (error) {
            alert(error);
          }
        }
      );
    }
  }, [ENDPOINT, JSON.stringify(user), JSON.stringify(room)]);

  //this useEffect is for handeling messages and only runs when messages array changes
  useEffect(() => {
    if (user) {
      socket.on("message", ({ text, userInfo, socket_user }) => {
        console.log(socket.id);
        console.log(socket_user);
        if (
          user.account_uid === userInfo.account_uid &&
          socket.id === socket_user
        ) {
          CallApi.ExecuteApi(
            CENTER_FACTORY,
            ENDPOINT + "/chat/insert_room_message",
            {
              room_id: room.room_id,
              message_content: text,
              send_member: userInfo.account_uid,
            }
          )
            .then((res) => {
              if (res.status === 200) {
                getMessages(true, "INSERT"); //更新新訊息
              } else {
                console.log(res);
              }
            })
            .catch((error) => {
              console.log("EROOR: Chat: /chat/insert_room_message");
              console.log(error);
            });
        } else {
          getMessages(false, "NEWMSG"); //更新新訊息
        }

        //add new messages to our messages array the ... copies the old messages and all we do is append the new
      });

      socket.on("roomData", ({ users }) => {
        setUsers(users);
      });
    }
  }, [JSON.stringify(user)]);

  useEffect(() => {
    if (user) {
      CallApi.ExecuteApi(
        CENTER_FACTORY,
        ENDPOINT + "/chat/update_message_read",
        {
          room_id: room.room_id,
          account_uid: user.account_uid,
        }
      )
        .then((res) => {
          if (res.status !== 200) {
            console.log(res);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/update_message_read");
          console.log(error);
        });
    }
  }, [JSON.stringify(users)]);

  useEffect(() => {
    if (user) {
      getMessages(false, "SCROLL"); //更新查詢資料
    }
  }, [page, messagesBottom]);

  function getMessages(isUserSendMessage: boolean, state: string, user?: any) {
    CallApi.ExecuteApi(CENTER_FACTORY, ENDPOINT + "/chat/get_room_message", {
      room_id: room.room_id,
      page: page,
    })
      .then((res) => {
        if (res.status === 200) {
          switch (state) {
            case "INIT":
              setMessages({
                data: res.data,
                isUserMessage: isUserSendMessage,
              });
              break;
            case "INSERT":
              if (
                messagesBottom ||
                res.data[res.data.length - 1].send_member === user.account_uid
              ) {
                setMessages({
                  data: res.data,
                  isUserMessage: isUserSendMessage,
                });
              } else {
                setNewMsg("");
              }
              break;
            case "NEWMSG":
              if (!messagesBottom) {
                setNewMsg(res.data[res.data.length - 1]);
              }

              setMessages({
                data: res.data,
                isUserMessage: isUserSendMessage,
              });
              break;
            case "SCROLL":
              setMessages({
                data: res.data,
                isUserMessage: isUserSendMessage,
              });
              break;
          }
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/get_room_message");
        console.log(error);
      });
  }

  //functioning for sending messages (its a functional component hence why its a function)
  const sendMessage = (event: { preventDefault: () => void; }) => {
    event.preventDefault(); // full browser refreshes aren't good

    if (message) {
      socket.emit(
        "sendMessage",
        { room: room.room_id, message: message, userInfo: user },
        () => setMessage("")
      ); //on the callback from index.js our input field clears
    }
  };

  // i need another component that will display the users
  return (
    <div className="container">
      <InfoBar room={room.room_id} />
      <Messages
        messages={messages}
        user={user}
        scrollGetMessage={() => {
          setPage(page + 1);
        }}
        onBottom={(onBottom) => {
          setMessagesBottom(onBottom);
        }}
        newMsg={newMsg}
        users={users}
      />
      <Input
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
