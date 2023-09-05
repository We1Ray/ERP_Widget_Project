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
  PublicMethod,
  SystemFunc,
  BtnCancel,
  BtnUpdate,
} from "../../resource/index";
import "ds-widget/dist/index.css";

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

  async function NotNull_handleValidation(value: string) {
    let msg = "";
    if (!PublicMethod.checkValue(value)) {
      msg = System.getLocalization("Public", "ErrorMsgEmpty");
    }
    return msg;
  }

  return (
    <div className="content-wrapper">
      <Card className="card-default">
        <CardBody>
          <Form program_code="admin.languagelocalisation" dataKey={["groupid"]}>
            <Block>
              <Column md={12}>
                <div className="input-group mb-3">
                  <div className="input-group-append">
                    <BtnQuery queryApi="/email/get_group" />
                    <BtnCreate insertApi="/email/create_group" />
                    <BtnDelete
                      deleteApi="/email/delete_group"
                      beforeDoDelete={beforeDoDelete}
                    />
                  </div>
                </div>

                <Row>
                  <Column md={6}>
                    <Label text={System.getLocalization("EMAIL", "GROUPID")} />
                    <TextBox query={true} name="groupid" />
                  </Column>
                  <Column md={6}>
                    <Label
                      text={System.getLocalization("EMAIL", "GROUPNAME")}
                    />
                    <TextBox query={true} name="groupname" />
                  </Column>
                </Row>
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
                        content: (
                          <Block head="資料">
                            <Column md={12}>
                              <ButtonToolbar>
                                <BtnUpdate
                                  updateApi="/email/update_group"
                                  style={{
                                    display:
                                      status.value === STATUS.CREATE
                                        ? "none"
                                        : "block",
                                  }}
                                />
                                <BtnSave
                                  style={{
                                    display:
                                      status.value === STATUS.CREATE ||
                                      status.value === STATUS.UPDATE
                                        ? "block"
                                        : "none",
                                  }}
                                />
                                <BtnCancel
                                  style={{
                                    display:
                                      status.value === STATUS.UPDATE
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
                                    text={System.getLocalization(
                                      "EMAIL",
                                      "GROUPID"
                                    )}
                                    bind={true}
                                    name="groupid"
                                  />
                                  <TextBox
                                    bind={true}
                                    name="groupid"
                                    defaultValue={"email-" + SystemFunc.uuid()}
                                    disabled={true}
                                    maxLength={60}
                                  />
                                </Column>
                                <Column md={6}>
                                  <Label
                                    text={System.getLocalization(
                                      "EMAIL",
                                      "GROUPNAME"
                                    )}
                                    bind={true}
                                    name="groupname"
                                  />
                                  <TextBox
                                    bind={true}
                                    name="groupname"
                                    maxLength={60}
                                    handleValidation={NotNull_handleValidation}
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
        </CardBody>
      </Card>
    </div>
  );
}
