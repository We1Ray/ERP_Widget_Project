import { Chat } from "../components/Chatroom";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import {
  Row,
  Column,
  Label,
  None,
  TextBox,
  CheckBox,
  SelectionBox,
  DraggableDialog,
  ProgramContext,
  ProgramProvider,
  SystemContext,
  statusContext,
  STATUS,
  ComponentContext,
  ComponentProvider,
  Form,
  BtnQuery,
  BtnSave,
  BtnCancel,
  BtnUpdate,
  BtnCreate,
  PublicMethod,
  CallApi,
  CENTER_FACTORY,
} from "../resource/index";
import "ds-widget/dist/index.css";

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
  const ENDPOINT = "http://10.1.50.59:81";
  const { System } = useContext(SystemContext);
  const { Component } = useContext(ComponentContext);
  const { Program } = useContext(ProgramContext);
  const { status } = useContext(statusContext);

  const [user, setUser] = useState(null);

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
  }, []);

  return (
    <div style={{ height: "87vh", padding: "10px" }}>
      {user ? (
        <Chat
          user={user}
          room={{
            room_name: null,
            room_id: "123456",
            is_group: "N",
            member: [
              {
                account: "POLORY.CHENG",
                account_uid: "ffa88e6b-6aed-4725-bbeb-c9a84b61fed3",
                email: "polory.cheng@deanshoes.com",
                name: "鄭吉甫",
              },
              {
                account: "WEIRAY.LIN",
                account_uid: "25b328a4-1c25-4b06-8ba7-ac9738c271c4",
                email: "weiray.lin@deanshoes.com",
                name: "林韋叡",
              },
            ],
          }}
        />
      ) : (
        <None />
      )}
    </div>
  );
}
