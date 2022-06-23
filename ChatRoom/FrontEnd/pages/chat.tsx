import io from "socket.io-client";
import { Collapse } from "reactstrap";
import { Chat } from "../components/Chatroom";
import React, { useContext, useEffect, useState } from "react";
import {
  None,
  ProgramProvider,
  SystemContext,
  ComponentProvider,
  CallApi,
  CENTER_FACTORY,
  Column,
  Row,
  SystemFunc,
} from "../resource/index";
import "ds-widget/dist/index.css";
import {
  userProps,
  roomProps,
} from "../components/Chatroom/components/Chat/Chat";
import moment, { now } from "moment";

let socket = null;

interface RoomList {
  room_member: string;
  room_id: string;
  room_name: string;
  create_date: string;
  create_d: string;
  create_hm: string;
  is_group: string;
  create_user: string;
  not_read_message_count: string;
  last_sender: string;
  message_id: string;
  last_message: string;
  last_date: string;
  last_d: string;
  last_hm: string;
}

export default function ChatRoom() {
  return (
    <ComponentProvider>
      <ProgramProvider>
        <ChatRoom_Content />
      </ProgramProvider>
    </ComponentProvider>
  );
}

function ChatRoom_Content() {
  const ENDPOINT = "http://localhost:81";
  const { System } = useContext(SystemContext);
  const [user, setUser] = useState<userProps>(null);
  const [room, setRoom] = useState<roomProps>(null);
  const [key, setKey] = useState("");
  const [roomList, setRoomList] = useState<RoomList[]>([]);
  const [newMessage, setNewMessage] = useState(null);

  /**
   * 取得使用者資訊
   */
  useEffect(() => {
    CallApi.ExecuteApi(CENTER_FACTORY, ENDPOINT + "/chat/get_userInfo", {
      access_token: System.token,
    })
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data[0]);
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/get_userInfo");
        console.log(error);
      });

    socket = io(ENDPOINT);
  }, []);

  /**
   * 取得使用者聊天室列表
   */
  useEffect(() => {
    if (user) {
      CallApi.ExecuteApi(CENTER_FACTORY, ENDPOINT + "/chat/get_room_info", {
        account_uid: user.account_uid,
      })
        .then((res) => {
          if (res.status === 200) {
            setRoomList(res.data);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_room_info");
          console.log(error);
        });

      socket.emit(
        "join",
        {
          room: {
            room_name: "public",
            room_id: "public",
            is_group: "Y",
          },
          userInfo: user,
        },
        (error: any) => {
          if (error) {
            alert(error);
          }
        }
      );
    } else {
      setRoomList([]);
    }
  }, [JSON.stringify(user)]);

  useEffect(() => {
    if (roomList.length > 0) {
      socket.on("message", ({ sendMessage, userInfo, socket_user }) => {
        setNewMessage(sendMessage);
      });
    } else {
      setNewMessage(null);
    }
  }, [JSON.stringify(roomList), JSON.stringify(room)]);

  function notInRoomUpdateMessageCount(originalRoom) {
    let messageRoom = originalRoom;
    messageRoom.last_message = newMessage.message_content;
    messageRoom.not_read_message_count = (
      parseInt(originalRoom.not_read_message_count) + 1
    ).toString();
    messageRoom.last_d = newMessage.d;
    messageRoom.last_hm = newMessage.hm;
    messageRoom.last_sender = newMessage.send_member_name;

    let newRoomlist = roomList.filter(
      (item) => item.room_id !== newMessage.room_id
    );
    newRoomlist.unshift(messageRoom);
    setRoomList(newRoomlist);
  }

  function inRoomUpdateMessageCount(originalRoom: any) {
    let newRoomList = roomList;
    let index = roomList.findIndex(
      (value) => value.room_id === originalRoom.room_id
    );
    if (index > -1) {
      let messageRoom = newRoomList[index];
      messageRoom.not_read_message_count = (0).toString();

      newRoomList[index] = messageRoom;
      setRoomList(newRoomList);
    }
  }

  useEffect(() => {
    if (newMessage) {
      let originalRoom = roomList.find(
        (data) => data.room_id === newMessage.room_id
      );
      if (originalRoom) {
        if (room) {
          if (room.room_id === newMessage.room_id) {
            let messageRoom = originalRoom;
            messageRoom.last_message = newMessage.message_content;
            messageRoom.not_read_message_count = (0).toString();
            messageRoom.last_d = newMessage.d;
            messageRoom.last_hm = newMessage.hm;
            messageRoom.last_sender = newMessage.send_member_name;

            let newRoomlist = roomList.filter(
              (item) => item.room_id !== newMessage.room_id
            );
            newRoomlist.unshift(messageRoom);
            setRoomList(newRoomlist);
          } else {
            notInRoomUpdateMessageCount(originalRoom);
          }
        } else {
          notInRoomUpdateMessageCount(originalRoom);
        }
      } else {
        //新創的聊天室訊息
      }
    }
  }, [JSON.stringify(newMessage)]);

  useEffect(() => {
    if (room) {
      setKey(SystemFunc.uuid());
      inRoomUpdateMessageCount(room);
    } else {
      setKey("");
    }
  }, [JSON.stringify(room)]);

  let Room = [];
  if (roomList) {
    for (let index = 0; index < roomList.length; index++) {
      Room.push(
        <li
          className="nav-item"
          onClick={() => {
            setRoom({
              room_name: roomList[index].room_name,
              room_id: roomList[index].room_id,
              is_group: roomList[index].is_group,
            });
          }}
          style={
            room
              ? room.room_id === roomList[index].room_id
                ? {
                    backgroundColor: "#C0D0D3",
                  }
                : {}
              : {}
          }
        >
          <a className="nav-link d-flex align-items-center">
            <p
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                verticalAlign: "middle",
              }}
            >
              <Column>
                <Row>
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#27397a",
                    }}
                  >
                    {roomList[index].room_name}
                    {roomList[index].is_group === "Y"
                      ? "(" +
                        roomList[index].room_member.split(";").length +
                        ")"
                      : ""}
                  </span>

                  {roomList[index].last_d ? (
                    moment(now()).year() ===
                    moment(roomList[index].last_d).year() ? (
                      moment(now()).date() ===
                      moment(roomList[index].last_d).date() ? (
                        <span
                          className="ml-auto "
                          style={{
                            color: "gray",
                            fontSize: "16px",
                          }}
                        >
                          {roomList[index].last_hm
                            ? roomList[index].last_hm
                            : ""}
                        </span>
                      ) : (
                        <span
                          className="ml-auto "
                          style={{
                            color: "gray",
                            fontSize: "16px",
                          }}
                        >
                          {moment(roomList[index].last_d).date()}
                        </span>
                      )
                    ) : (
                      <span
                        className="ml-auto "
                        style={{
                          color: "gray",
                          fontSize: "16px",
                        }}
                      >
                        {roomList[index].last_d}
                      </span>
                    )
                  ) : (
                    ""
                  )}
                </Row>
                <Row>
                  <span
                    style={{
                      color: "gray",
                      fontSize: "16px",
                    }}
                  >
                    {roomList[index].last_sender
                      ? roomList[index].last_sender + ":"
                      : ""}
                  </span>
                  &nbsp;
                  <span
                    style={{
                      color: "gray",
                      fontSize: "16px",
                    }}
                  >
                    {roomList[index].last_message
                      ? roomList[index].last_message.length > 10
                        ? roomList[index].last_message.substr(0, 9) + "..."
                        : roomList[index].last_message
                      : ""}
                  </span>
                  <span className="ml-auto badge badge-green">
                    {parseInt(roomList[index].not_read_message_count) > 0
                      ? roomList[index].not_read_message_count
                      : ""}
                  </span>
                </Row>
              </Column>
            </p>
          </a>
        </li>
      );
    }
  }

  return (
    <div className="content-wrapper">
      <Row>
        <Column md={3}>
          <Collapse className="mb-boxes" isOpen={true}>
            <div className="card card-default">
              <div className="card-body">
                <ul className="nav nav-pills flex-column">
                  <li className="nav-item p-2">
                    <h3 className="text-muted">聊天室</h3>
                  </li>
                  {Room}
                </ul>
              </div>
            </div>
            {/* END mailbox list */}
          </Collapse>
        </Column>
        <Column md={9}>
          {key !== "" ? (
            <div style={{ height: "87vh", padding: "10px" }} key={key}>
              <Chat user={user} room={room} />
            </div>
          ) : (
            <None />
          )}
        </Column>
      </Row>
    </div>
  );
}
