import React, { useContext, useEffect } from "react";
import { Card, CardBody, ButtonToolbar } from "reactstrap";
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
} from "../../resource/index";
import "ds-widget/dist/index.css";
import Email_group from "./email_group";

export default function Email() {
  return (
    <ComponentProvider>
      <ProgramProvider>
        <Email_Content />
      </ProgramProvider>
    </ComponentProvider>
  );
}

function Email_Content() {
  const { System, SystemDispatch } = useContext(SystemContext);
  const { Program } = useContext(ProgramContext);
  const { status } = useContext(statusContext);

  useEffect(() => {
    SystemDispatch({ type: "mustlogin", value: true });
  }, [JSON.stringify(System.factory)]);

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
      <Card className="card-default">
        <CardBody>
          <Form
            program_code="admin.languagelocalisation"
            dataKey={["email", "displayname"]}
          >
            <Block>
              <Column md={12}>
                <div className="input-group mb-3">
                  <div className="input-group-append">
                    <BtnQuery queryApi="/email/get_email" />
                    <BtnCreate insertApi="/email/create_email" />
                    <BtnDelete
                      deleteApi="/email/delete_email"
                      beforeDoDelete={beforeDoDelete}
                    />
                  </div>
                </div>

                <Row>
                  <Column md={6}>
                    <Label text={"Email : "} />
                    <TextBox query={true} name="email" />
                  </Column>
                  <Column md={6}>
                    <Label
                      text={System.getLocalization("EMAIL", "DISPLAYNAME")}
                    />
                    <TextBox query={true} name="displayname" />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <DataTable
                      bind={true}
                      columns={[
                        {
                          dataField: "email",
                          text: "Email",
                          sort: true,
                        },
                        {
                          dataField: "displayname",
                          text: System.getLocalization("EMAIL", "DISPLAYNAME"),
                          sort: true,
                        },
                      ]}
                      data={Program.data}
                      sizePerPageList={[10, 20, 50, 100]}
                      dialog={{
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
                                <Column md={6}>
                                  <Label
                                    text="Email "
                                    bind={true}
                                    name="email"
                                  />
                                  <TextBox
                                    bind={true}
                                    name="email"
                                    maxLength={60}
                                  />
                                </Column>
                                <Column md={6}>
                                  <Label
                                    text={System.getLocalization(
                                      "EMAIL",
                                      "DISPLAYNAME"
                                    )}
                                    bind={true}
                                    name="displayname"
                                  />
                                  <TextBox
                                    bind={true}
                                    name="displayname"
                                    maxLength={60}
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
          <Email_group
            email={Program.selectedData["email"]}
            displayname={Program.selectedData["displayname"]}
          />
        </CardBody>
      </Card>
    </div>
  );
}
