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
  DraggableDialog,
  SelectionBox,
  Label,
  TextBox,
} from "../resource/index";
import "ds-widget/dist/index.css";
import {
  userProps,
  roomProps,
} from "../components/Chatroom/components/Chat/Chat";
import moment, { now } from "moment";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

let socket = null;

interface roomList {
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
  const [roomList, setRoomList] = useState<roomList[]>([]);
  const [newMessage, setNewMessage] = useState(null);
  const [addGroupChatRoomOn, setAddGroupChatRoomOn] = useState(false);
  const [addChatRoomOn, setAddChatRoomOn] = useState(false);
  const [groupMemberList, setGroupMemberList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  let groupName = "";
  let groupMember = [];
  let member = [];

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
      CallApi.ExecuteApi(CENTER_FACTORY, ENDPOINT + "/chat/get_roomList_info", {
        account_uid: user.account_uid,
      })
        .then((res) => {
          if (res.status === 200) {
            setRoomList(res.data);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_roomList_info");
          console.log(error);
        });

      CallApi.ExecuteApi(CENTER_FACTORY, ENDPOINT + "/chat/get_memberList", {
        account_uid: user.account_uid,
      })
        .then((res) => {
          if (res.status === 200) {
            let member = [];
            for (let index = 0; index < 1000; index++) {
              // for (let index = 0; index < res.data.length; index++) {//要解決資料太大Lag問題
              member.push({
                value: res.data[index]["account_uid"],
                label: res.data[index]["name"],
                isFixed: false,
              });
            }
            setMemberList(member);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_memberList");
          console.log(error);
        });

      CallApi.ExecuteApi(
        CENTER_FACTORY,
        ENDPOINT + "/chat/get_groupMemberList",
        {
          account_uid: user.account_uid,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            let groupMember = [];
            for (let index = 0; index < 1000; index++) {
              // for (let index = 0; index < res.data.length; index++) {//要解決資料太大Lag問題
              groupMember.push({
                value: res.data[index]["account_uid"],
                label: res.data[index]["name"],
                isFixed: false,
              });
            }
            setGroupMemberList(groupMember);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_groupMemberList");
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
      setMemberList([]);
      setGroupMemberList([]);
    }
  }, [JSON.stringify(user)]);

  /**
   * 聊天室新訊息
   */
  useEffect(() => {
    if (roomList.length > 0) {
      socket.on("message", ({ sendMessage }) => {
        setNewMessage(sendMessage);
      });
    } else {
      setNewMessage(null);
    }
  }, [JSON.stringify(roomList), JSON.stringify(room)]);

  function notInRoomUpdateMessageCount(originalRoom: roomList) {
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

  function inRoomUpdateMessageCount(originalRoom: roomProps) {
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

  /**
   * 更新聊天室列表資訊
   */
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

  /**
   * 更新Key重置ChatRoom
   */
  useEffect(() => {
    if (room) {
      setKey(SystemFunc.uuid());
      inRoomUpdateMessageCount(room);
    } else {
      setKey("");
    }
  }, [JSON.stringify(room)]);

  async function creatGroupRoom() {
    console.log(groupName);
    console.log(groupMember);
    setAddGroupChatRoomOn(false);
  }

  function createPrivateRoom() {
    console.log(member);
    setAddChatRoomOn(false);
  }

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
              room_member: roomList[index].room_member,
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
                        moment(roomList[index].last_d).date() &&
                      moment(now()).month() ===
                        moment(roomList[index].last_d).month() ? (
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
                          {moment(roomList[index].last_d).month() +
                            1 +
                            "/" +
                            moment(roomList[index].last_d).date()}
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
      <DraggableDialog
        open={addChatRoomOn}
        style={{ width: "500px", height: "auto" }}
      >
        <Row>
          <Column
            style={{
              justifyContent: "flex-start",
            }}
          >
            <DialogTitle>建立聊天</DialogTitle>
          </Column>
          <DialogActions>
            <Column
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button onClick={() => setAddChatRoomOn(false)}>
                <i className="fas fa-times" />
              </Button>
            </Column>
          </DialogActions>
        </Row>
        <DialogContent>
          <Row>
            <Column>
              <Label>人員清單</Label>
              <SelectionBox
                multiple={false}
                options={memberList}
                result={(value) => {
                  member = value;
                }}
              />
            </Column>
          </Row>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => createPrivateRoom()}
            title="建立聊天室"
            style={{
              backgroundColor: "DeepSkyBlue",
              alignItems: "center",
              display: "flex",
            }}
          >
            <i
              className="fas fa-check"
              style={{
                color: "white",
              }}
            />
          </Button>
        </DialogActions>
      </DraggableDialog>
      <DraggableDialog
        open={addGroupChatRoomOn}
        style={{ width: "500px", height: "auto" }}
      >
        <Row>
          <Column
            style={{
              justifyContent: "flex-start",
            }}
          >
            <DialogTitle>建立群組</DialogTitle>
          </Column>
          <DialogActions>
            <Column
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button onClick={() => setAddGroupChatRoomOn(false)}>
                <i className="fas fa-times" />
              </Button>
            </Column>
          </DialogActions>
        </Row>
        <DialogContent>
          <Row>
            <Column>
              <Label>群組名稱</Label>
              <TextBox
                result={(value) => {
                  groupName = value;
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Label>群組人員</Label>
              <SelectionBox
                multiple={true}
                options={groupMemberList}
                result={(value) => {
                  groupMember = value;
                }}
              />
            </Column>
          </Row>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => creatGroupRoom()}
            title="建立群組"
            style={{
              backgroundColor: "DeepSkyBlue",
              alignItems: "center",
              display: "flex",
            }}
          >
            <i
              className="fas fa-check"
              style={{
                color: "white",
              }}
            />
          </Button>
        </DialogActions>
      </DraggableDialog>
      <Row>
        <Column md={3}>
          <Collapse className="mb-boxes" isOpen={true}>
            <div className="card card-default">
              <div className="card-body">
                <ul className="nav nav-pills flex-column">
                  <li className="nav-item p-2">
                    <h3 className="text-muted">
                      <i className="fas fa-comments" />
                      &ensp;聊天室
                      <Button
                        style={{
                          float: "right",
                        }}
                        title="建立群組"
                        onClick={() => {
                          setAddGroupChatRoomOn(true);
                        }}
                      >
                        <h4
                          className="fas fa-user-plus"
                          style={{
                            color: "#a7a7a7",
                            alignItems: "center",
                          }}
                        />
                      </Button>
                      <Button
                        style={{
                          float: "right",
                        }}
                        title="建立聊天"
                        onClick={() => {
                          setAddChatRoomOn(true);
                        }}
                      >
                        <h4
                          className="fas fa-user-alt"
                          style={{
                            color: "#a7a7a7",
                            alignItems: "center",
                          }}
                        />
                      </Button>
                    </h3>
                  </li>
                  {Room}
                </ul>
              </div>
            </div>
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
