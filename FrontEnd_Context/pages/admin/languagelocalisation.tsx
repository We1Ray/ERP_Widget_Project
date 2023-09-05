import React, { useContext, useEffect, useState } from "react";
import { Button, Card, CardBody, ButtonToolbar } from "reactstrap";
import XLSX from "xlsx";
import Swal from "sweetalert2/dist/sweetalert2.js";
import {
  Row,
  Column,
  Label,
  Block,
  TextBox,
  TextQryBox,
  DataTable,
  SelectionBox,
  DatetimeBox,
  QueryPattern,
  ProgramContext,
  ProgramProvider,
  SystemContext,
  statusContext,
  STATUS,
  ComponentProvider,
  Form,
  BtnQuery,
  BtnSave,
  BtnUpdate,
  BtnCreate,
  BtnDelete,
  BtnExcelImport,
  CallApi,
  PublicMethod,
  BtnCancel,
} from "../../resource/index";
import "ds-widget/dist/index.css";
import moment from "moment";
import Qry_accounts from "./Qry_accounts";

export default function LanguageLocalisation() {
  return (
    <ComponentProvider>
      <ProgramProvider>
        <LanguageLocalisation_Content />
      </ProgramProvider>
    </ComponentProvider>
  );
}

function LanguageLocalisation_Content() {
  const { System, SystemDispatch } = useContext(SystemContext);
  const { Program } = useContext(ProgramContext);
  const { status, send } = useContext(statusContext);
  const [source_Options, setSource_Options] = useState([]);
  const [language_Options, setLanguage_Options] = useState([]);
  const [updateParams, setUpdateParams] = useState([]);
  const [qryBoxLabel, setQryBoxLabel] = useState("");

  async function getQryBoxLabel(text: string) {
    if (text) {
      await CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/public/get_account",
        { account: text }
      )
        .then((res) => {
          if (res) {
            if (res.data[0]["name"]) {
              setQryBoxLabel(res.data[0]["name"]);
            } else {
              setQryBoxLabel(
                System.getLocalization("Public", "None") +
                  text +
                  System.getLocalization("Public", "Data")
              );
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  useEffect(() => {
    SystemDispatch({ type: "mustlogin", value: true });
  }, [JSON.stringify(System.factory)]);

  useEffect(() => {
    initial_Language_Options();
    initial_Source_Options();
  }, [Program.data]);

  function initial_Language_Options() {
    CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/languagelocalisation/get_language_list",
      {}
    )
      .then((res) => {
        if (res) {
          let option = [];
          for (let index = 0; index < res.data.length; index++) {
            option.push({
              value: res.data[index]["language"],
              label: res.data[index]["language"],
            });
          }
          setLanguage_Options(option);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function initial_Source_Options() {
    CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/languagelocalisation/get_source_list",
      {}
    )
      .then((res) => {
        if (res) {
          let option = [];
          for (let index = 0; index < res.data.length; index++) {
            option.push({
              value: res.data[index]["source"],
              label: res.data[index]["source"],
            });
          }
          setSource_Options(option);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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

  async function excel(excelData, sheets) {
    try {
      await Swal.fire({
        title: System.getLocalization("Public", "Warning"),
        text: System.getLocalization("Public", "ConfirmImortData") + "?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: System.getLocalization("Public", "Yes"),
        cancelButtonText: System.getLocalization("Public", "No"),
      }).then((alert) => {
        if (alert.isConfirmed) {
          let insertData = [];
          for (let i = 0; i < excelData.length; i++) {
            for (let j = 0; j < excelData[i].length; j++) {
              insertData.push({
                access_token: System.token,
                language: String(PublicMethod.getValue(excelData[i][j][0])),
                source: String(PublicMethod.getValue(excelData[i][j][1])),
                word: String(PublicMethod.getValue(excelData[i][j][2])),
                display: String(PublicMethod.getValue(excelData[i][j][3])),
              });
            }
          }
          CallApi.ExecuteApi(
            System.factory.name,
            System.factory.ip +
              "/languagelocalisation/create_languagelocalisation",
            insertData
          )
            .then((res) => {
              if (res.status === 200) {
                Swal.fire({
                  title: System.getLocalization("Public", "Success"),
                  text: System.getLocalization("Public", "CreateSuccess"),
                  icon: "success",
                  confirmButtonText: System.getLocalization("Public", "Yes"),
                }).then((alert) => {
                  send(STATUS.QUERY);
                });
              } else {
                Swal.fire(
                  System.getLocalization("Public", "Fail"),
                  System.getLocalization("Public", "CreateFail"),
                  "error"
                );
              }
            })
            .catch((error) => {
              console.log(error);
              Swal.fire(
                System.getLocalization("Public", "Fail"),
                System.getLocalization("Public", "CreateFail"),
                "error"
              );
            });
        } else {
          Swal.fire(
            System.getLocalization("Public", "Cancel"),
            System.getLocalization("Public", "CancelImport"),
            "warning"
          );
        }
      });
    } catch (e) {
      console.log("error:", e);
      Swal.fire(
        System.getLocalization("Public", "Fail"),
        System.getLocalization("Public", "CreateFail"),
        "error"
      );
    }
  }

  async function importDisable() {
    const updatePermmission = System.authority.filter(
      (permmission) =>
        permmission.program_code === Program.program_code &&
        permmission.function_code === "create" &&
        permmission.is_open === "Y"
    );
    if (PublicMethod.checkValue(updatePermmission)) {
      return false;
    } else {
      return true;
    }
  }

  async function doUpdate() {
    let flag = false;
    await CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/languagelocalisation/update_languagelocalisation",
      updateParams
    )
      .then(async (res) => {
        if (res.status === 200) {
          flag = true;
        } else {
          console.log(
            "EROOR: BtnUpdate.Update: " +
              System.factory.ip +
              "/languagelocalisation/update_languagelocalisation"
          );
          console.log(res);
          flag = false;
        }
      })
      .catch((error) => {
        console.log(
          "EROOR: BtnUpdate.Update: " +
            System.factory.ip +
            "/languagelocalisation/update_languagelocalisation"
        );
        console.log(error);
        flag = false;
      });
    return flag;
  }

  useEffect(() => {
    switch (status.value) {
      case STATUS.READ:
        setUpdateParams([]);
        break;
      default:
        break;
    }
  }, [status]);

  function expandContent(row) {
    const [data] = useState(row);
    const [display, setDisplay] = useState(row["display"]);

    useEffect(() => {
      switch (status.value) {
        case STATUS.READ:
          setDisplay(data["display"]);
          break;
        default:
          break;
      }
    }, [status]);

    useEffect(() => {
      let update = updateParams;
      let rowdata = PublicMethod.mergeJSON({}, data);
      rowdata["display"] = display;
      rowdata["access_token"] = System.token;
      if (status.matches(STATUS.UPDATE) && display !== data["display"]) {
        if (PublicMethod.checkValue(update)) {
          let index = update.findIndex((element) => {
            if (
              element["language"] === rowdata["language"] &&
              element["source"] === rowdata["source"] &&
              element["word"] === rowdata["word"]
            ) {
              return true;
            } else {
              return false;
            }
          });
          if (index > -1) {
            update[index] = rowdata;
          } else {
            update.push(data);
          }
        } else {
          update.push(data);
        }
        setUpdateParams(update);
      }
    }, [display]);

    return (
      <Block>
        <Column>
          <Row>
            <Column md={6}>
              <Label
                text={System.getLocalization(
                  "languagelocalisation",
                  "LANGUAGE"
                )}
                name="language"
              />
              <TextBox
                disabled={true}
                value={data["language"]}
                maxLength={20}
              />
            </Column>
            <Column md={6}>
              <Label
                text={System.getLocalization("languagelocalisation", "SOURCE")}
                name="source"
              />
              <TextBox disabled={true} value={data["source"]} maxLength={50} />
            </Column>
            <Column md={6}>
              <Label
                text={System.getLocalization("languagelocalisation", "WORD")}
                name="word"
              />
              <TextBox disabled={true} value={data["word"]} maxLength={100} />
            </Column>
            <Column md={6}>
              <Label
                text={System.getLocalization("languagelocalisation", "DISPLAY")}
                name="display"
              />
              <TextBox
                value={data["display"]}
                disabled={!status.matches(STATUS.UPDATE)}
                maxLength={200}
                result={(value) => {
                  switch (status.value) {
                    case STATUS.UPDATE:
                      setDisplay(value);
                      break;
                    default:
                      break;
                  }
                }}
              />
            </Column>
          </Row>
        </Column>
      </Block>
    );
  }

  function exportFile() {
    let data = [];
    for (let index = 0; index < Program.data.length; index++) {
      data.push([
        Program.data[index]["language"],
        Program.data[index]["source"],
        Program.data[index]["word"],
        Program.data[index]["display"],
      ]);
    }
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "localization");
    XLSX.writeFile(wb, "localization.xlsx");
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
          <Form
            program_code="admin.languagelocalisation"
            dataKey={["language", "source", "word"]}
          >
            <Block>
              <Column md={12}>
                <Row>
                  <Column md={9}>
                    <div className="input-group mb-3">
                      <div className="input-group-append">
                        <BtnQuery queryApi="/languagelocalisation/get_languagelocalisation" />
                        <BtnCreate
                          insertApi="/languagelocalisation/create_languagelocalisation"
                          defaultParameters={{ access_token: System.token }}
                        />
                        <BtnUpdate
                          style={{
                            display:
                              status.value === STATUS.CREATE ? "none" : "block",
                          }}
                          doUpdate={doUpdate}
                        />
                        <BtnSave
                          style={{
                            display:
                              status.value === STATUS.UPDATE ? "block" : "none",
                          }}
                        />
                        <BtnCancel
                          style={{
                            display:
                              status.value === STATUS.UPDATE ? "block" : "none",
                          }}
                        />
                        <BtnDelete
                          deleteApi="/languagelocalisation/delete_languagelocalisation"
                          beforeDoDelete={beforeDoDelete}
                          multiple={true}
                        />
                        <BtnExcelImport
                          importData={(data, sheets) => excel(data, sheets)}
                          disableFilter={importDisable}
                        />

                        <Button onClick={exportFile}>
                          <em className={"fas fa-file-excel"} />
                          &ensp;
                          {System.getLocalization("Public", "ExportExcel")}
                        </Button>
                      </div>
                    </div>
                  </Column>
                  <Column md={3}>
                    <QueryPattern
                      options={[
                        {
                          value: "languagelocalisation_KEY",
                          label: System.getLocalization(
                            "group_account",
                            "SEARCH_VALUE"
                          ),
                          isFixed: true,
                        },
                        {
                          value: "languagelocalisation_LANGUAGE",
                          label: System.getLocalization(
                            "languagelocalisation",
                            "LANGUAGE"
                          ),
                        },
                        {
                          value: "languagelocalisation_SOURCE",
                          label: System.getLocalization(
                            "languagelocalisation",
                            "SOURCE"
                          ),
                        },
                        {
                          value:
                            "languagelocalisation_UP_DATE1;languagelocalisation_UP_DATE2",
                          label: System.getLocalization(
                            "system_administrator",
                            "UP_DATE"
                          ),
                        },
                        {
                          value: "languagelocalisation_UP_USER",
                          label: System.getLocalization(
                            "system_administrator",
                            "UP_USER"
                          ),
                        },
                      ]}
                      defaultValue={[
                        {
                          value: "languagelocalisation_KEY",
                          label: System.getLocalization(
                            "group_account",
                            "SEARCH_VALUE"
                          ),
                          isFixed: true,
                        },
                      ]}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column md={6} name="languagelocalisation_LANGUAGE">
                    <Label
                      text={System.getLocalization(
                        "languagelocalisation",
                        "LANGUAGE"
                      )}
                    />
                    <SelectionBox
                      query={true}
                      name="languagelocalisation_LANGUAGE"
                      placeholder={System.getLocalization(
                        "Public",
                        "QuerySelectionMessage"
                      )}
                      multiple={true}
                      options={language_Options}
                      maxSelections={100}
                    />
                  </Column>
                  <Column md={6} name="languagelocalisation_SOURCE">
                    <Label
                      text={System.getLocalization(
                        "languagelocalisation",
                        "SOURCE"
                      )}
                    />
                    <SelectionBox
                      query={true}
                      name="languagelocalisation_SOURCE"
                      placeholder={System.getLocalization(
                        "Public",
                        "QuerySelectionMessage"
                      )}
                      multiple={true}
                      options={source_Options}
                      maxSelections={100}
                    />
                  </Column>
                  <Column md={6} name="languagelocalisation_KEY">
                    <Label
                      text={
                        System.getLocalization(
                          "group_account",
                          "SEARCH_VALUE"
                        ) + ":"
                      }
                    />
                    <TextBox query={true} name="languagelocalisation_KEY" />
                  </Column>
                  <Column md={6} name="languagelocalisation_UP_USER">
                    <Label
                      query={true}
                      name={"languagelocalisation_UP_USER"}
                      text={
                        System.getLocalization(
                          "system_administrator",
                          "UP_USER"
                        ) + ":"
                      }
                    />
                    <TextQryBox
                      query={true}
                      name="languagelocalisation_UP_USER"
                      maxLength={60}
                      dialog={{
                        window: Qry_accounts,
                        style: { width: 1000 },
                      }}
                      text={{
                        name: "account",
                        disabled: true,
                        visible: false,
                      }}
                      label={{
                        name: "name",
                        value: qryBoxLabel,
                      }}
                      result={getQryBoxLabel}
                      defaultValue="WEIRAY.LIN"
                      handleValidation={NotNull_handleValidation}
                    />
                  </Column>
                  <Column md={6} name="languagelocalisation_UP_DATE1">
                    <Label
                      text={
                        System.getLocalization(
                          "system_administrator",
                          "UP_DATE"
                        ) + ":"
                      }
                    />
                    <div className="input-group-append">
                      <DatetimeBox
                        query={true}
                        name="languagelocalisation_UP_DATE1"
                        format="yyyy/MM/dd"
                        mask="1111/11/11"
                      />
                      &nbsp;
                      <h2> ~ </h2>
                      &nbsp;
                      <DatetimeBox
                        query={true}
                        name="languagelocalisation_UP_DATE2"
                        format="yyyy/MM/dd"
                        mask="1111/11/11"
                      />
                    </div>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <DataTable
                      bind={true}
                      columns={[
                        {
                          dataField: "language",
                          text: System.getLocalization(
                            "languagelocalisation",
                            "LANGUAGE"
                          ),
                          sort: true,
                        },
                        {
                          dataField: "source",
                          text: System.getLocalization(
                            "languagelocalisation",
                            "SOURCE"
                          ),
                          sort: true,
                        },
                        {
                          dataField: "word",
                          text: System.getLocalization(
                            "languagelocalisation",
                            "WORD"
                          ),
                          sort: true,
                        },
                        {
                          dataField: "display",
                          text: System.getLocalization(
                            "languagelocalisation",
                            "DISPLAY"
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
                      ]}
                      data={Program.data}
                      multipleSelection={true}
                      sizePerPageList={[10, 20, 50, 100]}
                      Expand={({ row }) => expandContent(row)}
                      dialog={{
                        content: (
                          <Block head="資料編輯">
                            <Column md={12}>
                              <ButtonToolbar>
                                <BtnUpdate
                                  updateApi="/languagelocalisation/update_languagelocalisation"
                                  defaultParameters={{
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
                                      "languagelocalisation",
                                      "LANGUAGE"
                                    )}
                                    bind={true}
                                    name="language"
                                  />
                                  <TextBox
                                    bind={true}
                                    name="language"
                                    maxLength={20}
                                  />
                                </Column>
                                <Column md={6}>
                                  <Label
                                    text={System.getLocalization(
                                      "languagelocalisation",
                                      "SOURCE"
                                    )}
                                    bind={true}
                                    name="source"
                                  />
                                  <TextBox
                                    bind={true}
                                    name="source"
                                    maxLength={50}
                                  />
                                </Column>
                                <Column md={6}>
                                  <Label
                                    text={System.getLocalization(
                                      "languagelocalisation",
                                      "WORD"
                                    )}
                                    bind={true}
                                    name="word"
                                  />
                                  <TextBox
                                    bind={true}
                                    name="word"
                                    maxLength={100}
                                  />
                                </Column>
                                <Column md={6}>
                                  <Label
                                    text={System.getLocalization(
                                      "languagelocalisation",
                                      "DISPLAY"
                                    )}
                                    bind={true}
                                    name="display"
                                  />
                                  <TextBox
                                    bind={true}
                                    name="display"
                                    maxLength={200}
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
