import React, { useContext, useEffect, useState } from "react";
import { Card, ButtonToolbar, Input } from "reactstrap";
import Swal from "sweetalert2";
import {
  Row,
  Column,
  Label,
  DataTable,
  Block,
  TextBox,
  CheckBox,
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

export default function System_program_function({ system_uid, program_uid }) {
  return (
    <ProgramProvider>
      <System_program_function_Content
        system_uid={system_uid}
        program_uid={program_uid}
      />
    </ProgramProvider>
  );
}

function System_program_function_Content({ system_uid, program_uid }) {
  const { System } = useContext(SystemContext);
  const { Program } = useContext(ProgramContext);
  const { status, send } = useContext(statusContext);

  async function SEQ_handleValidation(value) {
    let seq_msg = "";
    if (PublicMethod.checkValue(value)) {
      let ErrorMsgNotNumber = System.getLocalization(
        "Public",
        "ErrorMsgNotNumber"
      );
      const re = /^[0-9\b]+$/;
      for (let index = 0; index < value.length; index++) {
        if (value[index] !== "" && !re.test(value[index])) {
          seq_msg = ErrorMsgNotNumber;
          break;
        }
      }
    }
    return seq_msg;
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

  useEffect(() => {
    //若Binding值更改重新查詢資料
    send(STATUS.QUERY);
  }, [system_uid, program_uid]);

  async function NotNull_handleValidation(value) {
    let msg = "";
    if (!PublicMethod.checkValue(value)) {
      msg = System.getLocalization("Public", "ErrorMsgEmpty");
    }
    return msg;
  }

  return (
    <Form
      program_code="admin.system.program.function"
      dataKey={["function_uid"]}
    >
      <BtnQuery
        queryApi="/system_program_function/get_system_program_functions"
        defaultQueryParameters={{
          functionadmin_PROGRAM_UID: program_uid,
          functionadmin_SYSTEM_UID: system_uid,
        }}
        style={{ display: "none" }}
        disableFilter={async () => {
          return PublicMethod.checkValue(program_uid) ? false : true;
        }}
      />
      <Row>
        <Column>
          <Card>
            <Row>
              <Column>
                <div className="input-group mb-3">
                  <div className="input-group-append">
                    <BtnCreate
                      insertApi="/system_program_function/create_system_program_function"
                      defaultParameters={{
                        system_uid: system_uid,
                        program_uid: program_uid,
                        function_uid: "FU-" + SystemFunc.uuid(),
                        access_token: System.token,
                      }}
                    />
                    <BtnDelete
                      multiple={true}
                      deleteApi="/system_program_function/delete_system_program_function"
                      beforeDoDelete={beforeDoDelete}
                    />
                    <BtnCancel />
                  </div>
                </div>
                <DataTable
                  bind={true}
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
                      dataField: "seq",
                      text: System.getLocalization(
                        "system_program_function",
                        "SEQ"
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
                          defaultValue={row.is_core}
                        />
                      ),
                    },
                    {
                      dataField: "enabled",
                      text: System.getLocalization(
                        "system_program_function",
                        "ENABLED"
                      ),
                      sort: true,
                      formatter: (cellContent, row) => (
                        <CheckBox
                          disabled={true}
                          checkedText={""}
                          checkedValue={"Y"}
                          notCheckedText={""}
                          notCheckedValue={"N"}
                          defaultValue={row.enabled}
                          value={row.enabled}
                        />
                      ),
                    },
                  ]}
                  data={Program.data}
                  multipleSelection={true}
                  dialog={{
                    content: (
                      <Block head="資料編輯">
                        <Column md={12}>
                          <ButtonToolbar>
                            <BtnUpdate
                              updateApi="/system_program_function/update_system_program_function"
                              defaultParameters={{
                                access_token: System.token,
                                function_uid: PublicMethod.checkValue(
                                  Program.selectedData["function_uid"]
                                )
                                  ? Program.selectedData["function_uid"]
                                  : "",
                              }}
                              style={{
                                display:
                                  status.value === STATUS.CREATE
                                    ? "none"
                                    : "block",
                              }}
                            />
                            <BtnSave />
                          </ButtonToolbar>
                        </Column>
                        <Column>
                          <Label
                            text={System.getLocalization(
                              "system_program_function",
                              "FUNCTION_CODE"
                            )}
                            bind={true}
                            name="function_code"
                          />
                          <TextBox
                            bind={true}
                            name="function_code"
                            maxLength={100}
                            disabled={status.value !== STATUS.CREATE}
                            handleValidation={NotNull_handleValidation}
                          />

                          <Label
                            text={System.getLocalization(
                              "system_program_function",
                              "FUNCTION_NAME"
                            )}
                            bind={true}
                            name="function_name"
                          />
                          <TextBox
                            bind={true}
                            name="function_name"
                            maxLength={150}
                          />

                          <Label
                            text={System.getLocalization(
                              "system_program_function",
                              "FUNCTION_DESC"
                            )}
                            bind={true}
                            name="function_desc"
                          />
                          <TextBox
                            bind={true}
                            name="function_desc"
                            maxLength={600}
                            area={true}
                          />

                          <Label
                            text={System.getLocalization(
                              "system_program_function",
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

                          <Label
                            text={System.getLocalization(
                              "system_program_function",
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
                            checkedText={System.getLocalization(
                              "Public",
                              "Yes"
                            )}
                            notCheckedText={System.getLocalization(
                              "Public",
                              "No"
                            )}
                          />

                          <Label
                            text={System.getLocalization(
                              "system_program_function",
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
                      </Block>
                    ),
                  }}
                />
              </Column>
            </Row>
          </Card>
        </Column>
      </Row>
    </Form>
  );
}
