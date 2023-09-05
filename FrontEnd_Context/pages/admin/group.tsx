import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CardBody,
} from "reactstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import {
  Row,
  Column,
  Label,
  TextBox,
  TextQryBox,
  Tree,
  CheckBox,
  None,
  Block,
  ComponentProvider,
  ProgramContext,
  ProgramProvider,
  SystemContext,
  Form,
  BtnQuery,
  BtnSave,
  BtnCancel,
  BtnCreate,
  BtnUpdate,
  BtnDelete,
  PublicMethod,
  SystemFunc,
} from "../../resource/index";
import "ds-widget/dist/index.css";
import Qry_group_list_for_admin from "./Qry_group_list_for_admin";
import Group_permissions from "./group_permissions";
import Group_account from "./group_account";
import "./group.scss";

export default function Group() {
  return (
    <ComponentProvider>
      <ProgramProvider>
        <Group_Content />
      </ProgramProvider>
    </ComponentProvider>
  );
}

function Group_Content() {
  const { System, SystemDispatch } = useContext(SystemContext);
  const { Program } = useContext(ProgramContext);
  const [activeTab, setActiveTab] = useState("groupinfo");
  const [group_uid, setGroup_uid] = useState("");
  const [group_name, setGroup_name] = useState("");
  const [is_core, setIs_core] = useState("");

  useEffect(() => {
    SystemDispatch({ type: "mustlogin", value: true });
  }, [JSON.stringify(System.factory)]);

  function treedata(list, parent = "") {
    let parentObj = {};
    list.forEach((o) => {
      parentObj[o.id] = o;
    });
    if (!parent) {
      return list
        .filter((o) => !parentObj[o.parent])
        .map((o) => ((o.children = treedata(list, o.id)), o));
    } else {
      return list
        .filter((o) => o.parent == parent)
        .map((o) => ((o.children = treedata(list, o.id)), o));
    }
  }

  function getTree() {
    let treelist = [];
    for (let index = 0; index < Program.data.length; index++) {
      treelist.push({
        id: Program.data[index]["group_uid"],
        label: Program.data[index]["group_name"],
        data: Program.data[index],
        parent: Program.data[index]["parent_group_uid"],
        expand: Program.data[index]["unfold"],
      });
    }
    return treedata(treelist);
  }

  async function updatedisable() {
    const updatePermmission = System.authority.filter(
      (permmission) =>
        permmission.program_code === Program.program_code &&
        permmission.function_code === "update" &&
        permmission.is_open === "Y"
    );

    if (PublicMethod.checkValue(updatePermmission)) {
      if (Program.selectedData["is_core"] === "Y") {
        const corePermmission = System.authority.filter(
          (permmission) =>
            permmission.program_code === Program.program_code &&
            permmission.function_code === "core" &&
            permmission.is_open === "Y"
        );
        if (PublicMethod.checkValue(corePermmission)) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  async function deletedisable() {
    const deletePermmission = System.authority.filter(
      (permmission) =>
        permmission.program_code === Program.program_code &&
        permmission.function_code === "delete" &&
        permmission.is_open === "Y"
    );

    if (PublicMethod.checkValue(deletePermmission)) {
      if (Program.selectedData["is_core"] === "Y") {
        const corePermmission = System.authority.filter(
          (permmission) =>
            permmission.program_code === Program.program_code &&
            permmission.function_code === "core" &&
            permmission.is_open === "Y"
        );
        if (PublicMethod.checkValue(corePermmission)) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  useEffect(() => {
    setGroup_uid(Program.selectedData["group_uid"]);
    setGroup_name(Program.selectedData["group_name"]);
    setIs_core(Program.selectedData["is_core"]);
  }, [JSON.stringify(Program.selectedData)]);

  async function NotNull_handleValidation(value) {
    if (!PublicMethod.checkValue(value)) {
      return System.getLocalization("Public", "ErrorMsgEmpty");
    } else {
      return "";
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
    <div className="content-wrapper">
      {PublicMethod.checkValue(System.token) ? (
        <Form program_code="admin.group" dataKey={["group_uid"]}>
          <Block>
            <Column md={3}>
              <Card className="card-default">
                <CardBody>
                  <div className="input-group mb-3">
                    <TextBox query={true} name="group_GROUP_NAME" />
                    <div className="input-group-append">
                      <BtnQuery queryApi="/group/get_group_list_for_admin" />
                    </div>
                  </div>
                  <Tree bind={true} data={getTree()} />
                </CardBody>
              </Card>
            </Column>
            {PublicMethod.checkValue(group_uid) ? (
              <Column md={9}>
                <Card className="card">
                  <form className="ie-fix-flex">
                    <div role="tabpanel">
                      <Nav tabs justified>
                        <NavItem>
                          <NavLink
                            className={
                              activeTab === "groupinfo" ? "active-tab" : ""
                            }
                            onClick={() => {
                              setActiveTab("groupinfo");
                            }}
                          >
                            {System.getLocalization("group", "Groupinfo")}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={
                              activeTab === "groupauthority" ? "active-tab" : ""
                            }
                            onClick={() => {
                              setActiveTab("groupauthority");
                            }}
                          >
                            {System.getLocalization("group", "Authority")}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={
                              activeTab === "groupaccount" ? "active-tab" : ""
                            }
                            onClick={() => {
                              setActiveTab("groupaccount");
                            }}
                          >
                            {System.getLocalization("group", "Account")}
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={activeTab}>
                        <TabPane tabId="groupinfo" role="tabpanel">
                          <Row>
                            <Column>
                              <div className="input-group mb-3">
                                <div className="input-group-append">
                                  <BtnCreate
                                    insertApi="/group/create_group"
                                    defaultParameters={{
                                      group_uid: "GP-" + SystemFunc.uuid(),
                                      access_token: System.token,
                                    }}
                                  />
                                  <BtnUpdate
                                    updateApi="/group/update_group"
                                    disableFilter={updatedisable}
                                    defaultParameters={{
                                      group_uid: PublicMethod.checkValue(
                                        Program.selectedData["group_uid"]
                                      )
                                        ? Program.selectedData["group_uid"]
                                        : "",
                                      access_token: System.token,
                                    }}
                                  />
                                  <BtnDelete
                                    deleteApi="/group/delete_group"
                                    disableFilter={deletedisable}
                                    beforeDoDelete={beforeDoDelete}
                                  />
                                  <BtnSave />
                                  <BtnCancel />
                                </div>
                              </div>
                            </Column>
                          </Row>
                          <Row>
                            <Column md={6}>
                              <Label
                                text={System.getLocalization(
                                  "group",
                                  "PARENT_GROUP_UID"
                                )}
                                bind={true}
                                name="parent_group_uid"
                              />
                              <TextQryBox
                                bind={true}
                                name="parent_group_uid"
                                maxLength={60}
                                dialog={{
                                  window: Qry_group_list_for_admin,
                                }}
                                text={{
                                  name: "group_uid",
                                  disabled: true,
                                  visible: false,
                                }}
                                label={{
                                  name: "group_name",
                                  api: "/group/qry_group_name",
                                }}
                              />
                            </Column>
                            <Column md={6}>
                              <Label
                                text={System.getLocalization(
                                  "group",
                                  "GROUP_NAME"
                                )}
                                bind={true}
                                name="group_name"
                              />
                              <TextBox
                                bind={true}
                                name="group_name"
                                maxLength={300}
                                handleValidation={NotNull_handleValidation}
                              />
                            </Column>

                            <Column md={6}>
                              <Label
                                text={System.getLocalization(
                                  "group",
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
                            <Column md={6}>
                              <Label
                                text={System.getLocalization(
                                  "group",
                                  "IS_CORE"
                                )}
                                bind={true}
                                name="is_core"
                              />
                              <CheckBox
                                bind={true}
                                name="is_core"
                                checkedValue="Y"
                                notCheckedValue="N"
                                disabled={
                                  !PublicMethod.checkValue(
                                    System.authority.filter(
                                      (permmission) =>
                                        permmission.program_code ===
                                          "admin.group" &&
                                        permmission.function_code === "core" &&
                                        permmission.is_open === "Y"
                                    )
                                  )
                                }
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
                        </TabPane>
                        <TabPane tabId="groupauthority" role="tabpanel">
                          <Group_permissions
                            group_uid={group_uid}
                            is_core={is_core}
                            group_name={group_name}
                          />
                        </TabPane>
                        <TabPane tabId="groupaccount" role="tabpanel">
                          <Group_account
                            group_uid={group_uid}
                            is_core={is_core}
                          />
                        </TabPane>
                      </TabContent>
                    </div>
                  </form>
                </Card>
              </Column>
            ) : (
              <></>
            )}
          </Block>
        </Form>
      ) : (
        <None />
      )}
    </div>
  );
}
