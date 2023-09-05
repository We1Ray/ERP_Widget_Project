import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import CallApi from "../../../api/CallApi";
import { Card, Button, Col } from "reactstrap";
import { SystemContext } from "../../system-control/SystemContext";
import {
  ProgramContext,
  statusContext,
  STATUS,
} from "../../system-control/ProgramContext";
import PublicMethod from "../../../methods/PublicMethod";
import { Row } from "../../system-ui/Row";
import { BindTextBox } from "../textbox/Bind";
import "./index.scss";
import { Label } from "../label";
import { None } from "../../system-ui/None";
import swal from "sweetalert";
import { TextQryBoxProps } from ".";
import useLatest from "../../../methods/useLatest";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DraggableDialog from "../../system-ui/DraggableDialog";

export const BindTextQryBox: React.FC<TextQryBoxProps> = forwardRef(
  (
    {
      visible,
      disabled,
      name,
      maxLength,
      defaultValue,
      value,
      handleValidation,
      delimiter,
      dialog,
      text,
      label,
      result,
      callbackRef,
      ...props
    },
    forwardedRef
  ) => {
    const { System } = useContext(SystemContext);
    const { Program } = useContext(ProgramContext);
    const { status } = useContext(statusContext);
    const [display, setDisplay] = useState(true);
    const [dialogOn, setDialogOn] = useState(false);
    const [objectDisable, setObjectDisable] = useState(false);
    const [labelValue, setLabelValue] = useState("");
    const [textboxValue, setTextboxValue] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const [dialogValue, setDialogValue] = useState({});
    const [textboxDisable, setTextboxDisable] = useState(false);
    const [valueDelimiter] = useState(
      PublicMethod.checkValue(delimiter) ? delimiter : ";"
    );
    const textboxRef = useRef(null);

    useImperativeHandle(forwardedRef, () => textboxRef.current);

    useEffect(() => {
      try {
        if (PublicMethod.checkValue(visible)) {
          setDisplay(visible);
        }
      } catch (error) {
        console.log("EROOR: BindTextQryBox.useEffect[visible]");
        console.log(error);
      }
    }, [visible]);

    useEffect(() => {
      try {
        if (PublicMethod.checkValue(callbackRef)) {
          callbackRef(textboxRef);
        }
      } catch (error) {
        console.log("EROOR: BindTextQryBox.useEffect()");
        console.log(error);
      }
    });

    function clearValue() {
      try {
        setSelectedValue("");
      } catch (error) {
        console.log("EROOR: BindTextQryBox.clearValue");
        console.log(error);
      }
    }

    async function selectQryValue() {
      try {
        if (PublicMethod.checkValue(dialogValue)) {
          if (Array.isArray(dialogValue)) {
            let multipleValue = "";
            for (let index = 0; index < dialogValue.length; index++) {
              if (index === dialogValue.length - 1) {
                multipleValue = multipleValue + dialogValue[index][text.name];
              } else {
                multipleValue =
                  multipleValue +
                  dialogValue[index][text.name] +
                  valueDelimiter;
              }
            }
            if (
              PublicMethod.checkValue(maxLength)
                ? multipleValue.length > maxLength
                  ? true
                  : false
                : false
            ) {
              swal(
                System.getLocalization("Public", "Fail"),
                System.getLocalization("Public", "ExceededWordLengthLimit") +
                  " " +
                  System.getLocalization("Public", "Word") +
                  System.getLocalization("Public", "Max") +
                  ":" +
                  maxLength +
                  System.getLocalization("Public", "CurrentLength") +
                  ":" +
                  ":" +
                  multipleValue.length,
                "error"
              );
            } else {
              setSelectedValue(multipleValue);
            }
          } else {
            if (
              PublicMethod.checkValue(maxLength)
                ? dialogValue[text.name].length > maxLength
                  ? true
                  : false
                : false
            ) {
              swal(
                System.getLocalization("Public", "Fail"),
                System.getLocalization("Public", "ExceededWordLengthLimit") +
                  " " +
                  System.getLocalization("Public", "Word") +
                  System.getLocalization("Public", "Max") +
                  ":" +
                  maxLength +
                  System.getLocalization("Public", "CurrentLength") +
                  ":" +
                  ":" +
                  dialogValue[text.name].length,
                "error"
              );
            } else {
              setSelectedValue(dialogValue[text.name]);
            }
          }
        }
        setDialogOn(false);
      } catch (error) {
        console.log("EROOR: BindTextQryBox.selectQryValue");
        console.log(error);
      }
    }

    useEffect(() => {
      try {
        if (value !== undefined && selectedValue !== value) {
          if (value) {
            setSelectedValue(value);
          } else {
            setSelectedValue("");
          }
        }
      } catch (error) {
        console.log("EROOR: BindTextQryBox.useEffect[value]");
        console.log(error);
      }
    }, [value]);

    /** 狀態改變執行的地方 */
    useEffect(() => {
      try {
        checkStatus();
      } catch (error) {
        console.log("EROOR: BindTextQryBox.useEffect[status]");
        console.log(error);
      }
    }, [status, disabled]);

    /** 確認目前作業狀態後更改欄位狀態 */
    function checkStatus() {
      try {
        switch (status.value) {
          case STATUS.READ:
            setDialogOn(false);
            setObjectDisable(true);
            break;
          case STATUS.CREATE:
            if (!PublicMethod.checkValue(defaultValue)) {
              //有綁定則設定禁用
              clearValue();
            } else {
              setSelectedValue(defaultValue);
            }
            checkDisable();
            break;
          case STATUS.UPDATE:
            if (Program.dataKey.indexOf(name) > -1) {
              //設定Key值不可編輯
              setObjectDisable(true);
            } else {
              checkDisable();
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.log("EROOR: BindTextQryBox.checkStatus");
        console.log(error);
      }
    }

    /** 判斷欄位是否禁用*/
    function checkDisable() {
      try {
        if (PublicMethod.checkValue(disabled)) {
          setObjectDisable(disabled);
        } else {
          setObjectDisable(false);
        }
      } catch (error) {
        console.log("EROOR: TextQryBox.checkDisable");
        console.log(error);
      }
    }

    useEffect(() => {
      try {
        if (objectDisable) {
          setTextboxDisable(objectDisable);
        } else {
          if (PublicMethod.checkValue(text.disabled)) {
            setTextboxDisable(text.disabled);
          } else {
            setTextboxDisable(false);
          }
        }
      } catch (error) {
        console.log("EROOR: BindTextQryBox.useEffect[objectDisable]");
        console.log(error);
      }
    }, [objectDisable]);

    useLatest(
      (latest) => {
        const lableChange = async () => {
          try {
            let lable = "";
            if (PublicMethod.checkValue(textboxValue)) {
              if (PublicMethod.checkValue(label.value)) {
                lable = label.value;
              } else if (PublicMethod.checkValue(label.api)) {
                await CallApi.ExecuteApi(
                  System.factory.name,
                  System.factory.ip + label.api,
                  PublicMethod.checkValue(label.defaultParameters)
                    ? PublicMethod.mergeJSON(
                        { [text.name]: textboxValue },
                        label.defaultParameters
                      )
                    : { [text.name]: textboxValue }
                ).then(async (res) => {
                  if (PublicMethod.checkValue(res.data)) {
                    //額外再給予Operation和api做查詢給值
                    lable = res.data[0][label.name];
                  } else {
                    lable =
                      System.getLocalization("Public", "None") +
                      textboxValue +
                      System.getLocalization("Public", "Data");
                  }
                });
              } else {
                lable =
                  System.getLocalization("Public", "None") +
                  textboxValue +
                  System.getLocalization("Public", "Data");
              }
            } else {
              lable =
                System.getLocalization("Public", "None") +
                System.getLocalization("Public", "Data");
            }
            if (latest()) {
              if (
                PublicMethod.checkValue(textboxValue) &&
                textboxValue !== selectedValue
              ) {
                setSelectedValue(textboxValue);
              }
              setLabelValue(lable);
            }
          } catch (error) {
            console.log(
              "EROOR: BindTextQryBox.useEffect[textboxValue, JSON.stringify(label)]"
            );
            console.log(error);
          }
        };
        lableChange();
      },
      [textboxValue, JSON.stringify(label)]
    );

    useEffect(() => {
      try {
        if (result) {
          result(textboxValue, labelValue);
        }
      } catch (error) {
        console.log("EROOR: QryTextQryBox.useEffect[labelValue]");
        console.log(error);
      }
    }, [labelValue]);

    function resultValue(value) {
      if (textboxValue !== value) {
        setTextboxValue(value);
      }
    }

    return (
      <div {...props}>
        {display ? (
          <>
            <Row>
              {
                <Col
                  md={5}
                  style={{
                    display: (
                      PublicMethod.checkValue(text.visible)
                        ? text.visible
                        : "block"
                    )
                      ? "block"
                      : "none",
                  }}
                >
                  <BindTextBox
                    name={name}
                    maxLength={maxLength}
                    disabled={textboxDisable}
                    defaultValue={defaultValue}
                    value={selectedValue}
                    handleValidation={handleValidation}
                    result={(value) => resultValue(value)}
                    style={text.style}
                    ref={textboxRef}
                  />
                </Col>
              }
              {(
                PublicMethod.checkValue(label.visible) ? label.visible : true
              ) ? (
                <Col md={5}>
                  <Label
                    style={label.style ? label.style : { fontWeight: "normal" }}
                  >
                    {labelValue}
                  </Label>
                </Col>
              ) : (
                <None />
              )}
              <div>
                <Button disabled={objectDisable} onClick={() => clearValue()}>
                  <em className="fa fa-trash"></em>
                </Button>
                <Button
                  disabled={objectDisable}
                  onClick={() => setDialogOn(!dialogOn)}
                >
                  <em className="fa fa-search"></em>
                </Button>
              </div>
            </Row>
            {PublicMethod.checkValue(dialogOn) ? (
              <DraggableDialog open={dialogOn && !objectDisable}>
                <DialogContent style={dialog.style}>
                  <dialog.window
                    callback={(value: any) => {
                      setDialogValue(value);
                    }}
                    {...dialog.parameter}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDialogOn(false)}>
                    <em className={"fas fa-ban"} />
                    &ensp;
                    {System.getLocalization("Public", "Cancel")}
                  </Button>
                  <Button color="success" onClick={selectQryValue}>
                    <em className={"far fa-save"} />
                    &ensp;
                    {System.getLocalization("Public", "Determine")}
                  </Button>
                </DialogActions>
              </DraggableDialog>
            ) : (
              <None />
            )}
          </>
        ) : (
          <None />
        )}
      </div>
    );
  }
);
