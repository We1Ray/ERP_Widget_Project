import React, { useContext, useState, useEffect } from "react";
import { Card, ButtonToolbar } from "reactstrap";
import Swal from "sweetalert2";
import {
  Column,
  Label,
  TextBox,
  TextQryBox,
  DataTable,
  Block,
  ProgramContext,
  ProgramProvider,
  statusContext,
  STATUS,
  SystemContext,
  Form,
  BtnQuery,
  BtnSave,
  BtnCreate,
  BtnDelete,
  CallApi,
  PublicMethod,
} from "../../resource/index";
import "ds-widget/dist/index.css";
import Qry_accounts_not_in_group from "./Qry_accounts_not_in_group";

export default function Group_account({ group_uid, is_core }) {
  return (
    <ProgramProvider>
      <Group_account_Content group_uid={group_uid} is_core={is_core} />
    </ProgramProvider>
  );
}

function Group_account_Content({ group_uid, is_core }) {
  const { System } = useContext(SystemContext);
  const { Program, ProgramDispatch } = useContext(ProgramContext);
  const { status, send } = useContext(statusContext);
  const [name, setName] = useState("");

  useEffect(() => {
    send(STATUS.QUERY);
  }, [group_uid]);


  useEffect(() => {
    switch (status.value) {
      case STATUS.CREATE:
        const insertParameters = Program.insertParameters;
        insertParameters["group_uid"] = group_uid;
        insertParameters["access_token"] = System.token;
        ProgramDispatch({ type: "insertParameters", value: insertParameters });
        break;
      default:
        break;
    }
  }, [status, JSON.stringify(System.token)]);

  async function updatedisable() {
    const updatePermmission = System.authority.filter(
      (permmission) =>
        permmission.program_code === Program.program_code &&
        permmission.function_code === "update" &&
        permmission.is_open === "Y"
    );

    if (PublicMethod.checkValue(updatePermmission)) {
      if (is_core === "Y") {
        const corePermmission = System.authority.filter(
          (permmission) =>
            permmission.program_code === "admin.group" &&
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
      if (is_core === "Y") {
        const corePermmission = System.authority.filter(
          (permmission) =>
            permmission.program_code === "admin.group" &&
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

  async function beforeDoDelete() {
    try {
      let doDelete = false;
      await Swal.fire({
        title: System.getLocalization("Public", "Warning"),
        text: System.getLocalization("Public", "ConfirmDeleteInformation"),
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
    <Card>
      <Form
        program_code="admin.group.account"
        dataKey={["account_uid", "group_uid"]}
      >
        <div className="row">
          <Column md={12}>
            <div className="input-group mb-3">
              <div className="input-group-append">
                <BtnQuery
                  queryApi="/group_account/get_accounts_in_group"
                  defaultQueryParameters={{
                    group_account_GROUP_UID: group_uid,
                  }}
                  disableFilter={async () => {
                    return PublicMethod.checkValue(group_uid) ? false : true;
                  }}
                />
                <BtnCreate
                  insertApi="/group_account/switch_account_into_group"
                  disableFilter={updatedisable}
                />
                <BtnDelete
                  multiple={true}
                  deleteApi="/group_account/switch_account_into_group"
                  disableFilter={deletedisable}
                  defaultParameters={{
                    group_uid: group_uid,
                    access_token: System.token,
                  }}
                  beforeDoDelete={beforeDoDelete}
                />
              </div>
            </div>
          </Column>
          <Column md={6}>
            <Label
              text={
                System.getLocalization("group_account", "SEARCH_VALUE") + ":"
              }
            />
            <TextBox query={true} name="group_account_SEARCH_VALUE" />
          </Column>
        </div>
        <DataTable
          bind={true}
          columns={[
            {
              dataField: "group_uid",
              text: System.getLocalization("group_account", "GROUP_UID"),
              sort: true,
              hidden: true,
            },
            {
              dataField: "account_uid",
              text: System.getLocalization("group_account", "ACCOUNT_UID"),
              sort: true,
              hidden: true,
            },
            {
              dataField: "account",
              text: System.getLocalization("system_administrator", "ACCOUNT"),
              sort: true,
            },
            {
              dataField: "name",
              text: System.getLocalization("system_administrator", "NAME"),
              sort: true,
            },
          ]}
          data={Program.data}
          multipleSelection={true}
          dialog={{
            style: { width: 400 },
            content: (
              <Block head={System.getLocalization("group", "group")}>
                <Column
                  md={12}
                  style={{
                    display: status.value === STATUS.READ ? "none" : "block",
                  }}
                >
                  <ButtonToolbar>
                    <BtnSave />
                  </ButtonToolbar>
                  <br />
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
                      window: Qry_accounts_not_in_group,
                      parameter: { group_uid: group_uid },
                      style: { width: 1000 },
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
                  />
                </Column>
              </Block>
            ),
          }}
        />
      </Form>
    </Card>
  );
}
