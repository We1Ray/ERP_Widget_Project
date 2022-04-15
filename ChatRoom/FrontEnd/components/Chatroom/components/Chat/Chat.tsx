import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";

import Input from "../Input/Input";
import InfoBar from "../InfoBar/InfoBar";
import Messages from "../Messages/Messages";
// import TextContainer from "../TextContainer/TextContainer";

import {
  CallApi,
  CENTER_FACTORY,
  CENTER_IP,
  SystemContext,
} from "../../../../resource/index";
import "./Chat.css";

let socket = null;

const Chat = ({ room }) => {
  const { System } = useContext(SystemContext);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const ENDPOINT = "http://10.1.50.59:81";

  useEffect(() => {
    CallApi.ExecuteApi(CENTER_FACTORY, ENDPOINT + "/chat/get_userInfo", {
      access_token: System.token,
    })
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data.rows[0]);
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/get_userInfo");
        console.log(error);
      });

    CallApi.ExecuteApi(CENTER_FACTORY, ENDPOINT + "/chat/get_room_message", {
      room_id: room,
    })
      .then((res) => {
        if (res.status === 200) {
          setMessages(res.data.rows);
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/get_room_message");
        console.log(error);
      });
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT);
    if (user) {
      socket.emit("join", { room, userInfo: user }, (error) => {
        if (error) {
          alert(error);
        }
      });
    }
  }, [ENDPOINT, JSON.stringify(user), room]);

  //this useEffect is for handeling messages and only runs when messages array changes
  useEffect(() => {
    if (user) {
      socket.on("message", ({ text, userInfo }) => {
        CallApi.ExecuteApi(
          CENTER_FACTORY,
          ENDPOINT + "/chat/insert_room_message",
          {
            room_id: room,
            message_content: text,
            send_member: userInfo.account_uid,
          }
        )
          .then((res) => {
            if (res.status === 200) {
              setMessages((messages) => [
                ...messages,
                {
                  room_id: room,
                  message_content: text,
                  send_member: userInfo.account_uid,
                  send_member_name: userInfo.name,
                  create_date: new Date().toISOString(),
                },
              ]);
            } else {
              console.log(res);
            }
          })
          .catch((error) => {
            console.log("EROOR: Chat: /chat/insert_room_message");
            console.log(error);
          });

        //add new messages to our messages array the ... copies the old messages and all we do is append the new
      });

      socket.on("roomData", ({ users }) => {
        setUsers(users);
      });
    }
  }, [JSON.stringify(user)]);

  //functioning for sending messages (its a functional component hence why its a function)
  const sendMessage = (event) => {
    event.preventDefault(); // full browser refreshes aren't good

    if (message) {
      socket.emit(
        "sendMessage",
        { room: room, message: message, userInfo: user },
        () => setMessage("")
      ); //on the callback from index.js our input field clears
    }
  };
  // console.log(message, messages);
  // i need another component that will display the users
  return (
    <div className="container">
      <InfoBar room={room} />
      <Messages messages={messages} user={user} />
      <Input
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
