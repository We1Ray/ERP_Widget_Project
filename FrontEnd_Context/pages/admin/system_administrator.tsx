import React, { useContext } from "react";
import { Card, ButtonToolbar } from "reactstrap";
import Swal from "sweetalert2";
import moment from "moment";
import {
  Row,
  Column,
  DatetimeBox,
  TextQryBox,
  Label,
  DataTable,
  Block,
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
} from "../../resource/index";
import "ds-widget/dist/index.css";
import Qry_accounts_not_in_system from "./Qry_accounts_not_in_system";

export default function System_administrator({ system_uid }) {
  return (
    <ProgramProvider>
      <System_administrator_Content system_uid={system_uid} />
    </ProgramProvider>
  );
}

function System_administrator_Content({ system_uid }) {
  const { System } = useContext(SystemContext);
  const { Program } = useContext(ProgramContext);
  const { status } = useContext(statusContext);

  async function NotNull_handleValidation(value) {
    let msg = "";
    if (!value) {
      msg = System.getLocalization("Public", "ErrorMsgEmpty");
    }
    return msg;
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
    <Form program_code="admin.system.administrator" dataKey={["account_uid"]}>
      <BtnQuery
        queryApi="/system_administrator/get_system_administrator"
        defaultQueryParameters={{ administrator_SYSTEM_UID: system_uid }}
        style={{ display: "none" }}
      />
      <Row>
        <Column>
          <Card>
            <Row>
              <Column>
                <div className="input-group mb-3">
                  <div className="input-group-append">
                    <BtnCreate
                      insertApi="/system_administrator/create_system_administrator"
                      defaultParameters={{
                        system_uid: system_uid,
                        access_token: System.token,
                      }}
                    />
                    <BtnDelete
                      multiple={true}
                      deleteApi="/system_administrator/delete_system_administrator"
                      beforeDoDelete={beforeDoDelete}
                      defaultParameters={{ system_uid: system_uid }}
                    />
                  </div>
                </div>
                <DataTable
                  bind={true}
                  columns={[
                    {
                      dataField: "account_uid",
                      text: System.getLocalization(
                        "system_administrator",
                        "ACCOUNT"
                      ),
                      hidden: true,
                    },
                    {
                      dataField: "account",
                      text: System.getLocalization(
                        "system_administrator",
                        "ACCOUNT"
                      ),
                      sort: true,
                    },
                    {
                      dataField: "name",
                      text: System.getLocalization(
                        "system_administrator",
                        "NAME"
                      ),
                      sort: true,
                    },
                    {
                      dataField: "expiration_date",
                      text: System.getLocalization(
                        "system_administrator",
                        "EXPIRATION_DATE"
                      ),
                      formatter: (cellContent, row) => (
                        <Label
                          text={
                            row.expiration_date
                              ? moment(row.expiration_date)
                                  .format("YYYY/MM/DD")
                                  .toString()
                              : ""
                          }
                        />
                      ),
                      sort: true,
                    },
                    {
                      dataField: "up_user",
                      text: System.getLocalization(
                        "system_administrator",
                        "UP_USER"
                      ),
                      sort: true,
                    },
                    {
                      dataField: "up_date",
                      text: System.getLocalization(
                        "system_administrator",
                        "UP_DATE"
                      ),
                      formatter: (cellContent, row) => (
                        <Label
                          text={
                            row.up_date
                              ? moment(row.up_date)
                                  .format("YYYY/MM/DD")
                                  .toString()
                              : ""
                          }
                        />
                      ),
                      sort: true,
                    },
                    {
                      dataField: "create_user",
                      text: System.getLocalization(
                        "system_administrator",
                        "CREATE_USER"
                      ),
                      sort: true,
                    },
                    {
                      dataField: "create_date",
                      text: System.getLocalization(
                        "system_administrator",
                        "CREATE_DATE"
                      ),
                      formatter: (cellContent, row) => (
                        <Label
                          text={
                            row.create_date
                              ? moment(row.create_date)
                                  .format("YYYY/MM/DD")
                                  .toString()
                              : ""
                          }
                        />
                      ),
                      sort: true,
                    },
                  ]}
                  data={Program.data}
                  multipleSelection={true}
                  dialog={{
                    style: { width: 400 },
                    content: (
                      <Block head="資料編輯">
                        <Column md={12}>
                          <ButtonToolbar>
                            <BtnUpdate
                              updateApi="/system_administrator/update_system_administrator"
                              defaultParameters={{
                                system_uid: system_uid,
                                access_token: System.token,
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
                              "system_administrator",
                              "ACCOUNT"
                            )}
                            bind={true}
                            name="account_uid"
                          />
                          <TextQryBox
                            bind={true}
                            name="account_uid"
                            maxLength={60}
                            dialog={{
                              window: Qry_accounts_not_in_system,
                              style: { width: 1000 },
                              parameter: { system_uid: system_uid },
                            }}
                            text={{
                              name: "account_uid",
                              disabled: true,
                              visible: false,
                            }}
                            label={{
                              name: "name",
                              api: "/system_administrator/get_account_info",
                            }}
                            handleValidation={NotNull_handleValidation}
                          />

                          <Label
                            text={System.getLocalization(
                              "system_administrator",
                              "EXPIRATION_DATE"
                            )}
                            bind={true}
                            name="expiration_date"
                          />
                          <DatetimeBox
                            bind={true}
                            name="expiration_date"
                            format="yyyy/MM/dd"
                            mask="1111/11/11"
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
