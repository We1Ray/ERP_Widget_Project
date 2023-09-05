import React, { useContext, useEffect, useState } from "react";
import { ButtonToolbar } from "reactstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import {
  Row,
  Column,
  Label,
  Block,
  TextBox,
  DataTable,
  ProgramContext,
  ProgramProvider,
  SystemContext,
  statusContext,
  STATUS,
  ComponentProvider,
  Form,
  BtnQuery,
  BtnSave,
  BtnCreate,
  BtnDelete,
  PublicMethod,
  SelectionBox,
  CallApi,
  None,
} from "../../resource/index";
import "ds-widget/dist/index.css";

export default function Email_group({ email, displayname }) {
  return (
    <ComponentProvider>
      <ProgramProvider>
        {email && displayname ? (
          <Email_group_Content email={email} displayname={displayname} />
        ) : (
          <None />
        )}
      </ProgramProvider>
    </ComponentProvider>
  );
}

function Email_group_Content({ email, displayname }) {
  const { System } = useContext(SystemContext);
  const { Program } = useContext(ProgramContext);
  const { status, send } = useContext(statusContext);
  const [group_Options, setGroup_Options] = useState([]);

  useEffect(() => {
    send(STATUS.QUERY);
  }, [email, displayname]);

  useEffect(() => {
    initial_Group_Options();
  }, [email, displayname, status]);

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

  function initial_Group_Options() {
    CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/email/get_email_group_list",
      status.value !== STATUS.CREATE && status.value !== STATUS.UPDATE
        ? {}
        : {
            email: email,
            displayname: displayname,
          }
    )
      .then((res) => {
        if (res) {
          let option = [];
          for (let index = 0; index < res.data.length; index++) {
            option.push({
              value: res.data[index]["groupid"],
              label: res.data[index]["groupname"],
            });
          }
          setGroup_Options(option);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Form program_code="email.group" dataKey={["groupid"]}>
      <div className="content-wrapper" />
      <Block>
        <Column md={12}>
          <div className="input-group mb-3">
            <div className="input-group-append">
              <BtnQuery
                queryApi="/email/get_email_group"
                initialQuery={false}
                defaultQueryParameters={{
                  email: email,
                  displayname: displayname,
                }}
                style={{ display: "none" }}
              />
              <BtnCreate
                insertApi="/email/create_email_group"
                defaultParameters={{
                  email: email,
                  displayname: displayname,
                }}
              />
              <BtnDelete
                deleteApi="/email/delete_email_group"
                defaultParameters={{
                  email: email,
                  displayname: displayname,
                }}
                beforeDoDelete={beforeDoDelete}
              />
            </div>
          </div>
          <Row>
            <Column>
              <DataTable
                bind={true}
                columns={[
                  {
                    dataField: "groupid",
                    text: System.getLocalization("EMAIL", "GROUPID"),
                    sort: true,
                  },
                  {
                    dataField: "groupname",
                    text: System.getLocalization("EMAIL", "GROUPNAME"),
                    sort: true,
                  },
                ]}
                data={Program.data}
                sizePerPageList={[10, 20, 50, 100]}
                dialog={{
                  style: {
                    minHeight: 200,
                    minWidth: 300,
                  },
                  content: (
                    <Block head="資料">
                      <Column md={12}>
                        <ButtonToolbar>
                          <BtnSave
                            style={{
                              display:
                                status.value === STATUS.CREATE
                                  ? "block"
                                  : "none",
                            }}
                          />
                        </ButtonToolbar>
                      </Column>
                      <Column>
                        <Row>
                          <Column>
                            <Label
                              text={System.getLocalization(
                                "EMAIL",
                                "GROUPNAME"
                              )}
                              bind={true}
                              name="groupid"
                            />
                            <SelectionBox
                              bind={true}
                              name="groupid"
                              maxLength={60}
                              multiple={false}
                              maxSelections={1}
                              options={group_Options}
                            />
                          </Column>
                        </Row>
                      </Column>
                    </Block>
                  ),
                }}
              />
            </Column>
          </Row>
        </Column>
      </Block>
    </Form>
  );
}
