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
  const { System } = useContext(SystemContext);
  const { Component } = useContext(ComponentContext);
  const { Program } = useContext(ProgramContext);
  const { status } = useContext(statusContext);

  return (
    <div style={{ height: "87vh", padding: "10px" }}>
      <Chat
        room={{
          room_id: "123456",
          is_group: "N",
        }}
      />
      {/* <Chat
        room={{
          room_id: "654321",
          is_group: "N",
        }}
      /> */}
    </div>
  );
}
