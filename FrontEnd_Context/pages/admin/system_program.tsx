import React, { useContext, useState, useEffect } from "react";
import { Card, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import {
  Row,
  Column,
  Label,
  Tree,
  TextQryBox,
  TextBox,
  CheckBox,
  ComponentContext,
  ProgramContext,
  ProgramProvider,
  SystemContext,
  statusContext,
  STATUS,
  Form,
  BtnQuery,
  BtnCreate,
  BtnDelete,
  BtnSave,
  BtnCancel,
  BtnUpdate,
  PublicMethod,
  SystemFunc,
} from "../../resource/index";
import "ds-widget/dist/index.css";
import Qry_system_program from "./Qry_system_program";
import System_program_function from "./system_program_function";
import "./system_program.scss";
import Swal from "sweetalert2";

export default function System_program({ system_uid }) {
  return (
    <ProgramProvider>
      <System_program_Content system_uid={system_uid} />
    </ProgramProvider>
  );
}

function System_program_Content({ system_uid }) {
  const { System } = useContext(SystemContext);
  const { Component } = useContext(ComponentContext);
  const { Program, ProgramDispatch } = useContext(ProgramContext);
  const { status } = useContext(statusContext);
  const [activeTab, setActiveTab] = useState("ProgramInfo");
  const [parent_code, setParent_code] = useState("");
  const [self_code, setSelf_code] = useState(undefined);

  function getTreeJsonFromData(treeitem) {
    let result = [];
    let level = { result };
    treeitem.forEach((treeitem) => {
      if (PublicMethod.checkValue(treeitem["program_code"])) {
        treeitem["program_code"].split(".").reduce((r, name, i, a) => {
          if (!r[name]) {
            r[name] = { result: [] };
            r.result.push({
              id: treeitem["program_uid"],
              label:
                (treeitem["is_dir"] == "Y" ? "*" : "") +
                treeitem["program_name"],
              data: treeitem,
              icon: treeitem["icon"],
              children: r[name].result,
            });
          }
          return r[name];
        }, level);
      }
    });
    return result;
  }

  useEffect(() => {
    switch (status.value) {
      case STATUS.READ:
        setParent_code("");
        setSelf_code("");
        break;
      default:
        setSelf_code(undefined);
        break;
    }
  }, [status]);

  useEffect(() => {
    switch (status.value) {
      case STATUS.CREATE:
        if (Program.changeData["parent_uid"]) {
          if (Component.selectedData["Qry_system_program"]) {
            setParent_code(
              Component.selectedData["Qry_system_program"]["program_code"]
            );
          }
        } else {
          setParent_code("");
        }
        break;
      default:
        break;
    }
  }, [
    JSON.stringify(Component.selectedData["Qry_system_program"]),
    Program.changeData["parent_uid"],
    status,
  ]);

  async function NotNull_handleValidation(value) {
    let msg = "";
    if (!PublicMethod.checkValue(value)) {
      msg = System.getLocalization("Public", "ErrorMsgEmpty");
    }
    return msg;
  }

  async function PROGRAM_CODE_handleValidation(value) {
    let msg = "";
    if (
      status.value === STATUS.CREATE &&
      !PublicMethod.checkValue(Program.changeData["parent_uid"])
    ) {
      if (!PublicMethod.checkValue(value)) {
        msg = System.getLocalization("Public", "ErrorMsgEmpty");
      } else if (value.indexOf(".") > -1) {
        msg = System.getLocalization("Public", "ErrorSelf_CodeIndexOfDot");
      }
    }
    return msg;
  }

  async function SELF_CODE_handleValidation(value) {
    let msg = "";
    if (
      status.value === STATUS.CREATE &&
      PublicMethod.checkValue(Program.changeData["parent_uid"])
    ) {
      if (!PublicMethod.checkValue(value)) {
        msg = System.getLocalization("Public", "ErrorMsgEmpty");
      } else if (value.indexOf(".") > -1) {
        msg = System.getLocalization("Public", "ErrorSelf_CodeIndexOfDot");
      }
    }
    return msg;
  }

  async function SEQ_handleValidation(value) {
    let seq_msg = "";
    const re = /^[0-9\b]+$/;
    if (value) {
      for (let index = 0; index < value.length; index++) {
        if (value[index] !== "" && !re.test(value[index])) {
          seq_msg = System.getLocalization("Public", "ErrorMsgNotNumber");
          break;
        }
      }
    }
    return seq_msg;
  }

  async function beforeDoCreate() {
    try {
      let code = "";
      const insertParameters = Program.insertParameters;
      const changeData = Program.changeData;
      if (PublicMethod.checkValue(parent_code)) {
        code = parent_code + "." + insertParameters["self_code"];
      } else {
        code = changeData["program_code"];
      }
      insertParameters["program_code"] = code;

      let nodelevel = code.split(".").length;
      insertParameters["node_level"] = nodelevel;

      ProgramDispatch({ type: "insertParameters", value: insertParameters });
      return true;
    } catch (e) {
      console.log("error:", e);
      return false;
    }
  }

  async function beforeDoDelete() {
    try {
      let doDelete = false;
      await Swal.fire({
        title: System.getLocalization("Public", "Warning"),
        text:
          System.getLocalization("Public", "ConfirmDeleteInformation") + "?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: System.getLocalization("Public", "Yes"),
        cancelButtonText: System.getLocalization("Public", "No"),
      }).then((alert) => {
        doDelete = !!(alert.value && alert.value === true);
      });
      return doDelete;
    } catch (e) {
      console.log("error:", e);
      return false;
    }
  }

  return (
    <Form program_code="admin.system.program" dataKey={["program_uid"]}>
      <BtnQuery
        queryApi="/system_program/get_system_programs_for_admin"
        defaultQueryParameters={{ programadmin_SYSTEM_UID: system_uid }}
        style={{ display: "none" }}
      />
      <Row>
        <Column md={3}>
          <Tree
            bind={true}
            data={getTreeJsonFromData(
              Program.data
            )} /*onClickValue={(e) => console.log(e)}*/
          />
        </Column>
        <Column md={9}>
          <Card>
            <form className="ie-fix-flex">
              <div role="tabpanel">
                <Nav tabs justified>
                  <NavItem>
                    <NavLink
                      className={
                        activeTab === "ProgramInfo" ? "active-tab" : ""
                      }
                      onClick={() => {
                        setActiveTab("ProgramInfo");
                      }}
                    >
                      {System.getLocalization("system_program", "ProgramInfo")}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === "Authority" ? "active-tab" : ""}
                      onClick={() => {
                        setActiveTab("Authority");
                      }}
                    >
                      {System.getLocalization(
                        "system_program",
                        "ProgramAuthority"
                      )}
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="ProgramInfo" role="tabpanel">
                    <Row>
                      <Column>
                        <div className="input-group mb-3">
                          <div className="input-group-append">
                            <BtnCreate
                              insertApi="/system_program/create_system_program"
                              beforeDoCreate={beforeDoCreate}
                              defaultParameters={{
                                system_uid: system_uid,
                                program_uid: "OP-" + SystemFunc.uuid(),
                                access_token: System.token,
                              }}
                            />
                            <BtnUpdate
                              updateApi="/system_program/update_system_program"
                              defaultParameters={{
                                access_token: System.token,
                                program_uid: PublicMethod.checkValue(
                                  Program.selectedData["program_uid"]
                                )
                                  ? Program.selectedData["program_uid"]
                                  : "",
                              }}
                            />
                            <BtnDelete
                              deleteApi="/system_program/delete_system_program"
                              beforeDoDelete={beforeDoDelete}
                            />
                            <BtnSave />
                            <BtnCancel />
                          </div>
                        </div>
                        <Row
                          style={{
                            display:
                              status.value === STATUS.CREATE ? "block" : "none",
                          }}
                        >
                          <Column>
                            <Label
                              text={System.getLocalization(
                                "system_program",
                                "PARENT_UID"
                              )}
                              bind={true}
                              name="parent_uid"
                            />
                            <TextQryBox
                              bind={true}
                              name="parent_uid"
                              maxLength={60}
                              dialog={{
                                window: Qry_system_program,
                                parameter: { system_uid: system_uid },
                              }}
                              text={{
                                name: "program_uid",
                                disabled: true,
                                visible: false,
                              }}
                              label={{
                                name: "program_name",
                                api: "/system_program/qry_programadim_program_name",
                              }}
                            />
                          </Column>
                        </Row>
                        <Row>
                          <Column>
                            <p
                              style={{
                                display:
                                  (status.value === STATUS.CREATE ||
                                    status.value === STATUS.SAVE) &&
                                  PublicMethod.checkValue(parent_code)
                                    ? "block"
                                    : "none",
                              }}
                            >
                              <Label
                                text={System.getLocalization(
                                  "system_program",
                                  "PROGRAM_CODE"
                                )}
                                bind={true}
                                name="self_code"
                              />
                              <Row>
                                <Column md={4}>
                                  <Label text={parent_code + "."} bind={true} />
                                </Column>
                                <Column md={8}>
                                  <TextBox
                                    bind={true}
                                    value={self_code}
                                    name="self_code"
                                    maxLength={60}
                                    handleValidation={
                                      SELF_CODE_handleValidation
                                    }
                                  />
                                </Column>
                              </Row>
                            </p>
                            <p
                              style={{
                                display:
                                  status.value === STATUS.CREATE &&
                                  PublicMethod.checkValue(parent_code)
                                    ? "none"
                                    : "block",
                              }}
                            >
                              <Label
                                text={System.getLocalization(
                                  "system_program",
                                  "PROGRAM_CODE"
                                )}
                                bind={true}
                                name="program_code"
                              />
                              <TextBox
                                bind={true}
                                name="program_code"
                                maxLength={60}
                                handleValidation={PROGRAM_CODE_handleValidation}
                              />
                            </p>
                          </Column>
                          <Column>
                            <Label
                              text={System.getLocalization(
                                "system_program",
                                "PROGRAM_NAME"
                              )}
                              bind={true}
                              name="program_name"
                            />
                            <TextBox
                              bind={true}
                              name="program_name"
                              maxLength={300}
                              handleValidation={NotNull_handleValidation}
                            />
                          </Column>
                        </Row>
                        <Row>
                          <Column>
                            <Label
                              text={System.getLocalization(
                                "system_program",
                                "I18N"
                              )}
                              bind={true}
                              name="i18n"
                            />
                            <TextBox bind={true} name="i18n" maxLength={300} />
                          </Column>
                          <Column>
                            <Label
                              text={System.getLocalization(
                                "system_program",
                                "ICON"
                              )}
                              bind={true}
                              name="icon"
                            />
                            <TextBox bind={true} name="icon" maxLength={300} />
                          </Column>
                        </Row>

                        <Row>
                          <Column>
                            <Label
                              text={System.getLocalization(
                                "system_program",
                                "IS_DIR"
                              )}
                              bind={true}
                              name="is_dir"
                            />
                            <CheckBox
                              bind={true}
                              name="is_dir"
                              checkedValue="Y"
                              notCheckedValue="N"
                              checkedText={System.getLocalization(
                                "Public",
                                "Yes"
                              )}
                              notCheckedText={System.getLocalization(
                                "Public",
                                "No"
                              )}
                            />
                          </Column>
                          <Column>
                            <Label
                              text={System.getLocalization(
                                "system_program",
                                "ENABLED"
                              )}
                              bind={true}
                              name="enabled"
                            />
                            <CheckBox
                              bind={true}
                              name="enabled"
                              checkedValue="Y"
                              notCheckedValue="N"
                              checkedText={System.getLocalization(
                                "Public",
                                "Yes"
                              )}
                              notCheckedText={System.getLocalization(
                                "Public",
                                "No"
                              )}
                            />
                          </Column>
                        </Row>
                        <Row>
                          <Column>
                            <Label
                              text={System.getLocalization(
                                "system_program",
                                "PATH"
                              )}
                              bind={true}
                              name="path"
                            />
                            <TextBox bind={true} name="path" maxLength={300} />
                          </Column>
                          <Column>
                            <Label
                              text={System.getLocalization(
                                "system_program",
                                "SEQ"
                              )}
                              bind={true}
                              name="seq"
                            />
                            <TextBox
                              bind={true}
                              name="seq"
                              maxLength={300}
                              handleValidation={SEQ_handleValidation}
                            />
                          </Column>
                        </Row>
                      </Column>
                    </Row>
                  </TabPane>
                  <TabPane tabId="Authority" role="tabpanel">
                    <System_program_function
                      system_uid={system_uid}
                      program_uid={Program.selectedData["program_uid"]}
                    />
                  </TabPane>
                </TabContent>
              </div>
            </form>
          </Card>
        </Column>
      </Row>
    </Form>
  );
}
