import React, { useContext, useState, useEffect } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import {
  Row,
  Column,
  Block,
  SelectionBox,
  None,
  Tree,
  DataTable,
  CheckBox,
  ProgramContext,
  ProgramProvider,
  statusContext,
  STATUS,
  SystemContext,
  ComponentContext,
  Form,
  BtnQuery,
  PublicMethod,
  CallApi,
} from "../../resource/index";
import "ds-widget/dist/index.css";

export default function Group_permission({ group_uid, is_core, group_name }) {
  return (
    <ProgramProvider>
      <Group_permissions_Content
        group_uid={group_uid}
        is_core={is_core}
        group_name={group_name}
      />
    </ProgramProvider>
  );
}

function Group_permissions_Content({ group_uid, is_core, group_name }) {
  const { System } = useContext(SystemContext);
  const { Component } = useContext(ComponentContext);
  const { Program } = useContext(ProgramContext);
  const { status, send } = useContext(statusContext);
  const [system_Options, setSystem_Options] = useState([]);
  const [factory_Options, setFactory_Options] = useState([]);
  const [programTree, setProgramTree] = useState([]);
  const [program_uid, setProgram_uid] = useState("");
  const [program_name, setProgram_name] = useState("");

  useEffect(() => {
    initial_System_Type_Option();
  }, [JSON.stringify(System.factory)]);

  function CheckCell({ row }) {
    const [editDisable, setEditDisable] = useState(true);
    const [check, setCheck] = useState("Y");

    useEffect(() => {
      dis();
      setCheck(row["is_open"]);
    }, [JSON.stringify(row)]);

    async function dis() {
      let disable = true;
      const updatePermmission = System.authority.filter(
        (permmission) =>
          permmission.program_code === Program.program_code &&
          permmission.function_code === "update" &&
          permmission.is_open === "Y"
      );

      if (PublicMethod.checkValue(updatePermmission)) {
        if (row["editable"] === "Y") {
          if (is_core === "Y") {
            const corePermmission = System.authority.filter(
              (permmission) =>
                permmission.program_code === "admin.group" &&
                permmission.function_code === "core" &&
                permmission.is_open === "Y"
            );
            if (PublicMethod.checkValue(corePermmission)) {
              disable = false;
            } else {
              disable = true;
            }
          } else {
            if (row["is_core"] === "Y") {
              const corePermmission = System.authority.filter(
                (permmission) =>
                  permmission.program_code === "admin.group" &&
                  permmission.function_code === "core" &&
                  permmission.is_open === "Y"
              );
              if (PublicMethod.checkValue(corePermmission)) {
                disable = false;
              } else {
                disable = true;
              }
            } else {
              disable = false;
            }
          }
        } else {
          disable = true;
        }
      }
      setEditDisable(disable);
    }

    function change(e) {
      if (e !== check && PublicMethod.checkValue(factory_Options)) {
        CallApi.ExecuteApi(
          System.factory.name,
          System.factory.ip + "/group_permissions/update_group_permission",
          {
            access_token: System.token,
            group_uid: row["group_uid"],
            factory_uid:
              Program.queryParameters["group_permission_FACTORY_UID"],
            function_uid: row["function_uid"],
            is_open: e,
            editable: "Y",
          }
        )
          .then((res) => {
            if (res.status !== 200) {
              console.log(res);
            } else {
              setCheck(e);
              row["is_open"] = e;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    return (
      <CheckBox
        disabled={editDisable}
        checkedText={""}
        checkedValue={"Y"}
        notCheckedText={""}
        notCheckedValue={"N"}
        defaultValue={check}
        value={check}
        result={(value, text) => {
          change(value);
        }}
      />
    );
  }

  function initial_System_Type_Option() {
    CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/system/get_account_available_systems",
      { systemadmin_ACCESS_TOKEN: System.token }
    )
      .then((res) => {
        if (res) {
          let option = [];
          for (let index = 0; index < res.data.length; index++) {
            option.push({
              value: res.data[index]["system_uid"],
              label: res.data[index]["system_name"],
            });
          }
          setSystem_Options(option);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/system_program/get_system_programs_for_admin",
      {
        programadmin_SYSTEM_UID:
          Program.queryParameters["group_permission_SYSTEM_UID"],
      }
    )
      .then((res) => {
        if (res) {
          setProgramTree(getTree(res.data));
        }
        setProgram_uid("");
        setProgram_name("");
      })
      .catch((error) => {
        console.log(error);
      });
  }, [JSON.stringify(Program.queryParameters["group_permission_SYSTEM_UID"])]);

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

  function getTree(data) {
    let treelist = [];
    for (let index = 0; index < data.length; index++) {
      treelist.push({
        id: data[index]["program_uid"],
        label:
          (data[index]["is_dir"] == "Y" ? "*" : "") +
          data[index]["program_name"],
        data: data[index],
        parent: data[index]["parent_uid"],
      });
    }
    return treedata(treelist);
  }

  useEffect(() => {
    if (
      PublicMethod.checkValue(program_uid) &&
      PublicMethod.checkValue(group_uid)
    ) {
      send(STATUS.QUERY);
    }
  }, [
    program_uid,
    group_uid,
    Program.queryParameters["group_permission_FACTORY_UID"],
  ]);

  function select_program(e) {
    if (PublicMethod.checkValue(e)) {
      setProgram_uid(e.id);
      setProgram_name(e.label);
    }
  }

  function treeDisabled() {
    let check = false;
    for (var key in Component.status) {
      if (check) break;
      if (Component.status[key] === STATUS.READ) {
        for (var key2 in Component.loading) {
          if (check) break;
          if (Component.loading[key2] === "READ") {
            check = false;
          } else {
            check = true;
          }
        }
      } else {
        check = true;
      }
    }
    return check;
  }

  useEffect(() => {
    getFactory_Option();
  }, [Program.queryParameters["group_permission_SYSTEM_UID"]]);

  function getFactory_Option() {
    CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/system_factory/get_system_factory",
      { system_uid: Program.queryParameters["group_permission_SYSTEM_UID"] }
    )
      .then((res) => {
        if (res) {
          let option = [];
          for (let index = 0; index < res.data.length; index++) {
            option.push({
              value: res.data[index]["factory_uid"],
              label: res.data[index]["factory_name"],
            });
          }
          setFactory_Options(option);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <Row>
        <Column md={3}>
          <legend className="mb-2">
            <b>
              {System.getLocalization("group", "GROUP_NAME") +
              ":" +
              PublicMethod.checkValue(group_name)
                ? group_name
                : ""}
            </b>
          </legend>
          {PublicMethod.checkValue(system_Options) ? (
            <SelectionBox
              query={true}
              name="group_permission_SYSTEM_UID"
              placeholder={System.getLocalization(
                "group_permission",
                "SelectSystem"
              )}
              options={system_Options}
              multiple={false}
              maxSelections={1}
            />
          ) : (
            <None />
          )}
          <p />
          <Tree
            data={programTree}
            onClickValue={select_program}
            disabled={treeDisabled()}
          />
        </Column>
        <Column md={9}>
          {PublicMethod.checkValue(factory_Options) ? (
            <>
              <legend className="mb-1">
                <b>{System.getLocalization("group_permission", "Factory")}</b>
              </legend>
              <div className="mb-2">
                <div style={{ width: "30%" }}>
                  <SelectionBox
                    query={true}
                    name="group_permission_FACTORY_UID"
                    placeholder={System.getLocalization(
                      "group_permission",
                      "SelectFactory"
                    )}
                    value={factory_Options[0]}
                    options={factory_Options}
                    multiple={false}
                    maxSelections={1}
                  />
                </div>
              </div>
            </>
          ) : (
            <None />
          )}
          <Form
            program_code="admin.group.permissions"
            dataKey={["function_uid"]}
          >
            <BtnQuery
              queryApi="/group_permissions/get_group_permissions"
              defaultQueryParameters={{
                group_permission_GROUP_UID: group_uid,
                group_permission_PROGRAM_UID: program_uid,
                group_permission_FACTORY_UID:
                  Program.queryParameters["group_permission_FACTORY_UID"],
              }}
              style={{ display: "none" }}
            />
            <legend className="mb-2">
              <b>
                {PublicMethod.checkValue(program_name)
                  ? program_name + " - "
                  : ""}
                {System.getLocalization(
                  "group_permission",
                  "Permission_Setting"
                )}
              </b>
            </legend>
            <Block>
              {PublicMethod.checkValue(program_name) ? (
                <Column>
                  <DataTable
                    striped
                    hover
                    condensed
                    keyField="none"
                    data={Program.data}
                    columns={[
                      {
                        dataField: "function_uid",
                        text: System.getLocalization(
                          "system_program_function",
                          "FUNCTION_UID"
                        ),
                        sort: true,
                        hidden: true,
                      },
                      {
                        dataField: "is_open",
                        text: System.getLocalization(
                          "group_permission",
                          "IS_OPEN"
                        ),
                        sort: true,
                        formatter: (cell, row, rowIndex) => (
                          <CheckCell row={row} />
                        ),
                      },
                      {
                        dataField: "function_code",
                        text: System.getLocalization(
                          "system_program_function",
                          "FUNCTION_CODE"
                        ),
                        sort: true,
                      },
                      {
                        dataField: "function_name",
                        text: System.getLocalization(
                          "system_program_function",
                          "FUNCTION_NAME"
                        ),
                        sort: true,
                      },
                      {
                        dataField: "function_desc",
                        text: System.getLocalization(
                          "system_program_function",
                          "FUNCTION_DESC"
                        ),
                        sort: true,
                      },
                      {
                        dataField: "is_core",
                        text: System.getLocalization(
                          "system_program_function",
                          "IS_CORE"
                        ),
                        sort: true,
                        formatter: (cellContent, row) => (
                          <CheckBox
                            disabled={true}
                            checkedText={""}
                            checkedValue={"Y"}
                            notCheckedText={""}
                            notCheckedValue={"N"}
                            value={row.is_core}
                          />
                        ),
                      },
                    ]}
                    pagination={paginationFactory({
                      pageStartIndex: 1,
                      sizePerPage: 5,
                      sizePerPageList: [5, 10, 20, 30, 50, 100],
                      pageNumber: 1,
                      alwaysShowAllBtns: true,
                    })}
                    noDataIndication={System.getLocalization(
                      "Public",
                      "NoInformationFound"
                    )}
                  />
                </Column>
              ) : (
                <None />
              )}
            </Block>
          </Form>
        </Column>
      </Row>
    </>
  );
}
