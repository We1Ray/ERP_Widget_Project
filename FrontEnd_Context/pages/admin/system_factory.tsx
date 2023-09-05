import React, { useContext } from "react";
import { Card, ButtonToolbar } from "reactstrap";
import Swal from "sweetalert2";
import {
  Row,
  Column,
  TextBox,
  Label,
  DataTable,
  Block,
  CheckBox,
  QueryPattern,
  ProgramContext,
  ProgramProvider,
  SystemContext,
  statusContext,
  STATUS,
  Form,
  BtnQuery,
  BtnDelete,
  BtnSave,
  BtnUpdate,
  BtnCreate,
  SystemFunc,
} from "../../resource/index";
import "ds-widget/dist/index.css";

export default function System_factory({ system_uid }) {
  return (
    <ProgramProvider>
      <System_factory_Content system_uid={system_uid} />
    </ProgramProvider>
  );
}

function System_factory_Content({ system_uid }) {
  const { System } = useContext(SystemContext);
  const { Program } = useContext(ProgramContext);
  const { status } = useContext(statusContext);

  async function NotNull_handleValidation(value) {
    let msg = "";
    if (!value) {
      msg = System.getLocalization("Public", "ErrorMsgEmpty");
      return msg;
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
    <Form program_code="admin.system.factory" dataKey={["factory_uid"]}>
      <Card>
        <Row>
          <Column md={9}>
            <div className="input-group mb-3">
              <div className="input-group-append">
                <BtnQuery
                  queryApi="/system_factory/get_system_factory"
                  defaultQueryParameters={{ system_uid: system_uid }}
                />
                <BtnCreate
                  insertApi="/system_factory/create_system_factory"
                  defaultParameters={{
                    system_uid: system_uid,
                    factory_uid: "FACT-" + SystemFunc.uuid(),
                  }}
                />
                <BtnDelete
                  multiple={true}
                  deleteApi="/system_factory/delete_system_factory"
                  beforeDoDelete={beforeDoDelete}
                />
              </div>
            </div>
          </Column>
          <Column md={3}>
            <QueryPattern
              options={[
                {
                  value: "system_factory_IS_ENABLED",
                  label: System.getLocalization("system_factory", "IS_ENABLED"),
                },
              ]}
            />
          </Column>
        </Row>
        <div className="content">
          <Label
            text={System.getLocalization("system_factory", "IS_ENABLED") + ":"}
            query={true}
            name="system_factory_IS_ENABLED"
          />
          <CheckBox
            query={true}
            name="system_factory_IS_ENABLED"
            checkedValue="Y"
            notCheckedValue="N"
            checkedText={System.getLocalization("Public", "Yes")}
            notCheckedText={System.getLocalization("Public", "No")}
          />
        </div>
        <DataTable
          bind={true}
          columns={[
            {
              dataField: "factory_uid",
              text: System.getLocalization("system_factory", "FACTORY_NAME"),
              sort: true,
              hidden: true,
            },
            {
              dataField: "factory_name",
              text: System.getLocalization("system_factory", "FACTORY_NAME"),
              sort: true,
            },
            {
              dataField: "ws_url",
              text: System.getLocalization("system_factory", "WS_URL"),
              sort: true,
            },
            {
              dataField: "ws_datasource",
              text: System.getLocalization("system_factory", "WS_DATASOURCE"),
              sort: true,
            },
            {
              dataField: "is_enabled",
              text: System.getLocalization("system_factory", "IS_ENABLED"),
              formatter: (cellContent, row) => (
                <CheckBox
                  disabled={true}
                  checkedText={""}
                  checkedValue={"Y"}
                  notCheckedText={""}
                  notCheckedValue={"N"}
                  value={row.is_enabled}
                />
              ),
              sort: true,
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
                      updateApi="/system_factory/update_system_factory"
                      defaultParameters={{
                        factory_uid: Program.selectedData["factory_uid"],
                      }}
                      style={{
                        display:
                          status.value === STATUS.CREATE ? "none" : "block",
                      }}
                    />
                    <BtnSave />
                  </ButtonToolbar>
                </Column>
                <Column>
                  <Label
                    text={System.getLocalization(
                      "system_factory",
                      "FACTORY_NAME"
                    )}
                    bind={true}
                    name="factory_name"
                  />
                  <TextBox
                    bind={true}
                    name="factory_name"
                    maxLength={300}
                    handleValidation={NotNull_handleValidation}
                  />

                  <Label
                    text={System.getLocalization("system_factory", "WS_URL")}
                    bind={true}
                    name="ws_url"
                  />
                  <TextBox
                    bind={true}
                    name="ws_url"
                    maxLength={300}
                    handleValidation={NotNull_handleValidation}
                  />

                  <Label
                    text={System.getLocalization(
                      "system_factory",
                      "WS_DATASOURCE"
                    )}
                    bind={true}
                    name="ws_datasource"
                  />
                  <TextBox bind={true} name="ws_datasource" maxLength={300} />

                  <Label
                    text={System.getLocalization(
                      "system_factory",
                      "IS_ENABLED"
                    )}
                    bind={true}
                    name="is_enabled"
                  />
                  <CheckBox
                    bind={true}
                    name="is_enabled"
                    checkedValue="Y"
                    notCheckedValue="N"
                    checkedText={System.getLocalization("Public", "Yes")}
                    notCheckedText={System.getLocalization("Public", "No")}
                  />
                </Column>
              </Block>
            ),
          }}
        />
      </Card>
    </Form>
  );
}
