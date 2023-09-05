import React, { useContext, useEffect, useRef, useState } from "react";
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
  BtnFileUpload,
  // Window,
} from "../../resource/index";
import "ds-widget/dist/index.css";
import System_program from "./system_program";
import System_administrator from "./system_administrator";
import System_factory from "./system_factory";
import "./system.scss";

function System() {
  return (
    <ComponentProvider>
      <ProgramProvider>
        <System_Content />
      </ProgramProvider>
    </ComponentProvider>
  );
}

function System_Content() {
  const { System, SystemDispatch } = useContext(SystemContext);
  const { Component } = useContext(ComponentContext);
  const { Program } = useContext(ProgramContext);
  const { status } = useContext(statusContext);
  const [dialogOn, setDialogOn] = useState(false);
  const [system_uid, setSystem_uid] = useState("");
  const [system_name, setSystem_name] = useState("");
  const [activeTab, setActiveTab] = useState("system");
  const [backButtonDisable, setBackButtonDisable] = useState(false);
  const [system_Type_Options, setSystem_Type_Options] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    initial_System_Type_Option();
    SystemDispatch({ type: "mustlogin", value: true });
  }, [JSON.stringify(System.factory)]);

  async function initial_System_Type_Option() {
    await CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/system/get_system_type_list",
      {}
    )
      .then((res) => {
        let option = [];
        if (res) {
          for (let index = 0; index < res.data.length; index++) {
            option.push({
              value: res.data[index]["system_type"],
              label: res.data[index]["system_type_name"],
            });
          }
          setSystem_Type_Options(option);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    switch (status.value) {
      case STATUS.CREATE:
        setDialogOn(true);
        break;
      case STATUS.READ:
        setDialogOn(false);
        break;
      default:
        break;
    }
  }, [status]);

  function systemInformation(name, uid) {
    if (name === "" && uid === "") {
      let status_all_read = true;
      for (var key in Component.status) {
        if (!status_all_read) break;
        if (Component.status[key] !== STATUS.READ) {
          status_all_read = false;
        }
      }
      if (status_all_read) {
        setSystem_name(name);
        setSystem_uid(uid);
      }
    } else {
      setActiveTab("system");
      setSystem_name(name);
      setSystem_uid(uid);
    }
  }

  useEffect(() => {
    backButtonStatusCheck();
  }, [JSON.stringify(Component.status)]);

  function backButtonStatusCheck() {
    let status_all_read = true;
    for (var key in Component.status) {
      if (!status_all_read) break;
      if (Component.status[key] !== STATUS.READ) {
        status_all_read = false;
      }
    }
    setBackButtonDisable(!status_all_read);
  }

  function dataContent(system_Type_Options: any[]) {
    return (
      <>
        <Row>
          <Column>
            <Label
              text={System.getLocalization("system", "SYSTEM_NAME")}
              bind={true}
              name="system_name"
            />
            <TextBox
              bind={true}
              name="system_name"
              maxLength={100}
              handleValidation={NotNull_handleValidation}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <Label
              text={System.getLocalization("system", "SYSTEM_DESC")}
              bind={true}
              name="system_desc"
            />
            <TextBox
              bind={true}
              name="system_desc"
              maxLength={1000}
              area={true}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <Label
              text={System.getLocalization("system", "SYSTEM_TYPE")}
              bind={true}
              name="system_type"
            />
            <SelectionBox
              bind={true}
              name="system_type"
              placeholder={System.getLocalization(
                "Public",
                "QuerySelectionMessage"
              )}
              options={system_Type_Options}
              handleValidation={NotNull_handleValidation}
              multiple={false}
              maxSelections={1}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <Label
              text={System.getLocalization("system", "ENABLED")}
              bind={true}
              name="enabled"
            />
            <CheckBox
              bind={true}
              name="enabled"
              checkedValue="Y"
              notCheckedValue="N"
              checkedText={System.getLocalization("Public", "Yes")}
              notCheckedText={System.getLocalization("Public", "No")}
            />
          </Column>
        </Row>
      </>
    );
  }

  async function NotNull_handleValidation(value: string) {
    let msg = "";
    if (!PublicMethod.checkValue(value)) {
      msg = System.getLocalization("Public", "ErrorMsgEmpty");
    }
    return msg;
  }
  const defaultAppState = {
    component: () => {
      return (
        <div
          style={{
            height: "1000px",
            width: "100%",
          }}
        >
          77777
        </div>
      );
    },
    header: {
      title: "Internet Explorer",
      icon: "/static/img/ie-paper.png",
      // invisible: true,
    },
    defaultSize: {
      width: 500,
      height: 400,
    },
    defaultOffset: {
      x: 350,
      y: -100,
    },
    resizable: true,
    minimized: false,
    maximized: false,
    id: "123",
    ParentRef: contentRef,
  };

  async function doUpload(e: File[] | FileList) {
    console.log(e);
  }

  return (
    <div
      style={{ height: PublicMethod.checkValue(system_uid) ? "100%" : "90vh" }}
      ref={contentRef}
    >
      {PublicMethod.checkValue(System.token) &&
      PublicMethod.checkValue(System.system_uid) ? (
        <>
          {PublicMethod.checkValue(system_uid) ? (
            <div className="content-wrapper">
              <div className="content-heading">
                <Button
                  onClick={() => systemInformation("", "")}
                  disabled={backButtonDisable}
                >
                  <i className="fa fa-arrow-left" />
                </Button>
                &nbsp;
                {system_name}
              </div>
              <Card>
                <form className="ie-fix-flex">
                  <div role="tabpanel">
                    <Nav tabs justified>
                      <NavItem>
                        <NavLink
                          className={activeTab === "system" ? "active-tab" : ""}
                          onClick={() => {
                            setActiveTab("system");
                          }}
                        >
                          {System.getLocalization("system", "SystemAdmin")}
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={
                            activeTab === "program" ? "active-tab" : ""
                          }
                          onClick={() => {
                            setActiveTab("program");
                          }}
                        >
                          {System.getLocalization("system", "ProgramAdmin")}
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={activeTab === "role" ? "active-tab" : ""}
                          onClick={() => {
                            setActiveTab("role");
                          }}
                        >
                          {System.getLocalization("system", "RoleAdmin")}
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={
                            activeTab === "factory" ? "active-tab" : ""
                          }
                          onClick={() => {
                            setActiveTab("factory");
                          }}
                        >
                          {System.getLocalization(
                            "system_factory",
                            "system_factory"
                          )}
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="system" role="tabpanel">
                        <Form
                          program_code="admin.system"
                          dataKey={["system_uid"]}
                        >
                          <BtnQuery
                            queryApi="/system/get_account_available_systems"
                            defaultQueryParameters={{
                              systemadmin_ACCESS_TOKEN: System.token,
                              systemadmin_SYSTEM_UID: system_uid,
                            }}
                            style={{ display: "none" }}
                          />
                          <Row>
                            <Column>
                              <div className="input-group mb-3">
                                <div className="input-group-append">
                                  <BtnUpdate
                                    updateApi="/system/update_system"
                                    defaultParameters={{
                                      access_token: System.token,
                                    }}
                                  />
                                  <BtnSave />
                                  <BtnCancel />
                                </div>
                              </div>
                            </Column>
                          </Row>
                          <Row>
                            <Column>
                              <Label
                                text={System.getLocalization(
                                  "system",
                                  "SYSTEM_UID"
                                )}
                                bind={true}
                                name="system_uid"
                              />
                              <TextBox
                                bind={true}
                                name="system_uid"
                                maxLength={100}
                                disabled={true}
                              />
                            </Column>
                          </Row>
                          <Row>
                            <Column>
                              <Label
                                text={System.getLocalization(
                                  "system",
                                  "SECRET_KEY"
                                )}
                                bind={true}
                                name="secret_key"
                              />
                              <TextBox
                                bind={true}
                                name="secret_key"
                                maxLength={100}
                                disabled={true}
                              />
                            </Column>
                          </Row>
                          {dataContent(system_Type_Options)}
                        </Form>
                      </TabPane>
                      <TabPane tabId="program" role="tabpanel">
                        <System_program system_uid={system_uid} />
                      </TabPane>
                      <TabPane tabId="role" role="tabpanel">
                        <System_administrator system_uid={system_uid} />
                      </TabPane>
                      <TabPane tabId="factory" role="tabpanel">
                        <System_factory system_uid={system_uid} />
                      </TabPane>
                    </TabContent>
                  </div>
                </form>
              </Card>
            </div>
          ) : (
            <Form program_code="admin.system" dataKey={["system_uid"]}>
              <div className="content-wrapper">
                <Row>
                  <Column md={6}>
                    <div className="input-group mb-3">
                      <TextBox query={true} name="systemadmin_SYSTEM_NAME" />
                      <div className="input-group-append">
                        <BtnQuery
                          queryApi="/system/get_account_available_systems"
                          defaultQueryParameters={{
                            systemadmin_ACCESS_TOKEN: System.token,
                          }}
                        />
                        <DraggableDialog open={dialogOn}>
                          <DialogContent style={{ width: "400px" }}>
                            <Column>{dataContent(system_Type_Options)}</Column>
                          </DialogContent>
                          <DialogActions>
                            <BtnSave />
                            <BtnCancel />
                          </DialogActions>
                        </DraggableDialog>
                      </div>
                    </div>
                  </Column>
                </Row>
                <Row>
                  {Program.data.map((data) => (
                    <Column md="3">
                      <Card className="card card-default">
                        <CardBody className="text-center">
                          <h4>{data["system_name"]}</h4>
                          <p>{data["system_desc"]}</p>
                        </CardBody>
                        <CardFooter className="d-flex">
                          <div className="ml-auto">
                            <button
                              type="button"
                              className="btn btn-md btn-secondary"
                              onClick={() =>
                                systemInformation(
                                  data["system_name"],
                                  data["system_uid"]
                                )
                              }
                            >
                              {System.getLocalization("system", "View")}
                            </button>
                          </div>
                        </CardFooter>
                      </Card>
                    </Column>
                  ))}
                </Row>
                {/* <BtnFileUpload
                  multiple={true}
                  immediatelyUpload={true}
                  doUpload={doUpload}
                /> */}
              </div>
              <BtnCreate
                insertApi="/system/create_system"
                defaultParameters={{
                  system_uid: "SYS-" + new Date().getTime(),
                  secret_key: PublicMethod.makeid(16),
                  access_token: System.token,
                }}
                style={
                  System.isMobile
                    ? {
                        display: PublicMethod.checkValue(system_uid)
                          ? "none"
                          : "inline-block",
                        borderRadius: "50%",
                        padding: 10,
                        width: 75,
                        height: 75,
                        bottom: 5,
                        right: 25,
                      }
                    : {
                        padding: 10,
                        display: PublicMethod.checkValue(system_uid)
                          ? "none"
                          : "inline-block",
                        borderRadius: "50%",
                        width: 75,
                        height: 75,
                        position: "absolute",
                        bottom: 5,
                        right: 25,
                      }
                }
                childObject={<em className="fa-2x fas fa-plus" />}
              />
            </Form>
          )}

          {/* <Window app={defaultAppState} focusedAppId={"123"} /> */}
        </>
      ) : (
        <None />
      )}
    </div>
  );
}

export default System;
