import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { SystemContext } from "../../system-control/SystemContext";
import {
  ProgramContext,
  statusContext,
  STATUS,
} from "../../system-control/ProgramContext";
import PublicMethod from "../../../methods/PublicMethod";
import { None } from "../../system-ui/None";
import { showCurrentValue } from "./TextBox";
import { TextBoxProps, handleKeyDown, getheight } from "./TextBox";
import useLatest from "../../../methods/useLatest";

export const BindTextBox: React.FC<TextBoxProps> = forwardRef(
  (
    {
      visible,
      disabled,
      name,
      maxLength,
      defaultValue,
      value,
      handleValidation,
      result,
      area,
      style,
      callbackRef,
      ...props
    },
    forwardedRef
  ) => {
    const { System } = useContext(SystemContext);
    const { Program, ProgramDispatch } = useContext(ProgramContext);
    const { status } = useContext(statusContext);
    const [textboxValue, setTextboxValue] = useState("");
    const [textboxDisable, setTextboxDisable] = useState(false);
    const [backColor, setBackColor] = useState(undefined);
    const [display, setDisplay] = useState(true);
    const [focus, setFocus] = useState(false);
    const [initial, setInitial] = useState(true);
    const [textArea] = useState(PublicMethod.checkValue(area) ? area : false);
    const textboxRef = useRef(null);

    useImperativeHandle(forwardedRef, () => textboxRef.current);

    useEffect(() => {
      try {
        if (PublicMethod.checkValue(callbackRef)) {
          callbackRef(textboxRef);
        }
      } catch (error) {
        console.log("EROOR: BindTextBox.useEffect()");
        console.log(error);
      }
    });

    useEffect(() => {
      try {
        if (PublicMethod.checkValue(visible)) {
          setDisplay(visible);
        }
      } catch (error) {
        console.log("EROOR: BindTextBox.useEffect[visible]");
        console.log(error);
      }
    }, [visible]);

    useEffect(() => {
      try {
        showCurrentValue(textboxRef, textboxValue);
        //???????????????????????????????????????????????????????????????
        if (Program.changeData[name] !== textboxValue) {
          ProgramDispatch({
            type: "changeData",
            value: { [name]: textboxValue },
          });
        }
        if (result) {
          result(textboxValue);
        }
      } catch (error) {
        console.log("EROOR: BindTextBox.useEffect[textboxValue, status]");
        console.log(error);
      }
    }, [textboxValue]);

    useEffect(() => {
      try {
        if (textArea) {
          if (style) {
            if (!style.height) {
              getheight(textboxRef);
            }
          } else {
            getheight(textboxRef);
          }
        }
      } catch (error) {
        console.log("EROOR: BindTextBox.useEffect");
        console.log(error);
      }
    });

    useEffect(() => {
      checkStatus();
    }, [status, disabled]);

    useEffect(() => {
      try {
        if (value !== undefined && textboxValue !== value) {
          if (value) {
            setTextboxValue(value);
          } else {
            setTextboxValue("");
          }
        }
      } catch (error) {
        console.log("EROOR: BindTextBox.useEffect[value]");
        console.log(error);
      }
    }, [value]);

    /**?????????????????????????????????*/
    useEffect(() => {
      bindData();
    }, [JSON.stringify(Program.selectedData[name])]);

    useEffect(() => {
      try {
        setBindValueToStatusParameter();
      } catch (error) {
        console.log("EROOR: BindTextBox.useEffect[textboxValue, status]");
        console.log(error);
      }
    }, [textboxValue, status]);

    useLatest(
      (latest) => {
        /** ?????????????????????????????????*/
        const validation = async (newValue: any) => {
          try {
            let valid = "";
            if (
              status.matches(STATUS.CREATE) &&
              Program.dataKey.indexOf(name) > -1 &&
              !PublicMethod.checkValue(newValue)
            ) {
              //??????Key???????????????
              valid = System.getLocalization("Public", "ErrorMsgEmpty");
            } else if (
              (status.matches(STATUS.UPDATE) ||
                status.matches(STATUS.CREATE)) &&
              PublicMethod.checkValue(handleValidation)
            ) {
              //????????????/????????? ????????????????????????
              valid = await handleValidation(newValue);
            }
            if (latest()) {
              let validation = Program.validation;
              if (PublicMethod.checkValue(valid)) {
                validation.bind[name] = valid;
                await ProgramDispatch({
                  type: "validation",
                  value: validation,
                });
              } else {
                delete validation.bind[name];
                await ProgramDispatch({
                  type: "validation",
                  value: validation,
                });
              }
            }
          } catch (error) {
            console.log("EROOR: BindTextBox.valueValidation");
            console.log(error);
          }
        };
        validation(Program.changeData[name]);
      },
      [System.lang, status, JSON.stringify(Program.changeData)]
    );

    /** ????????????????????????????????????????????? */
    function checkStatus() {
      try {
        switch (status.value) {
          case STATUS.READ:
            bindData();
            setTextboxDisable(true);
            setBackColor(undefined);
            break;
          case STATUS.CREATE:
            checkDisable();
            if (PublicMethod.checkValue(defaultValue)) {
              //???????????????
              setTextboxValue(defaultValue);
            } else {
              setTextboxValue("");
            }
            if (Program.dataKey.indexOf(name) > -1) {
              //??????Key????????????????????????
              setBackColor("#f9eb40");
            } else {
              setBackColor(undefined);
            }
            break;
          case STATUS.UPDATE:
            setBackColor(undefined);
            if (Program.dataKey.indexOf(name) > -1) {
              //??????Key???????????????
              setTextboxDisable(true);
            } else {
              checkDisable();
            }
            break;
          default:
            setBackColor(undefined);
            break;
        }
      } catch (error) {
        console.log("EROOR: BindTextBox.checkStatus");
        console.log(error);
      }
    }

    useEffect(() => {
      try {
        if (initial) {
          setInitial(false);
        } else {
          if (!focus) {
            setTextboxValue(textboxRef.current.value);
          }
        }
      } catch (error) {
        console.log("EROOR: BindTextBox.useEffect[focus]");
        console.log(error);
      }
    }, [focus]);

    /** ????????????????????????*/
    function checkDisable() {
      try {
        if (PublicMethod.checkValue(disabled)) {
          setTextboxDisable(disabled);
        } else {
          setTextboxDisable(false);
        }
      } catch (error) {
        console.log("EROOR: BindTextBox.checkDisable");
        console.log(error);
      }
    }

    /**?????????????????????????????????????????????*/
    function bindData() {
      try {
        if (!status.matches(STATUS.CREATE)) {
          if (PublicMethod.checkValue(Program.data)) {
            //?????????????????????
            setTextboxValue(Program.selectedData[name]);
          } else {
            setTextboxValue("");
          }
        }
      } catch (error) {
        console.log("EROOR: BindTextBox.bindData");
        console.log(error);
      }
    }

    function setBindValueToStatusParameter() {
      try {
        switch (status.value) {
          case STATUS.CREATE:
            if (Program.insertParameters[name] !== textboxValue) {
              ProgramDispatch({
                type: "insertParameters",
                value: { [name]: textboxValue },
              });
            }
            break;
          case STATUS.UPDATE:
            if (Program.updateParameters[name] !== textboxValue) {
              ProgramDispatch({
                type: "updateParameters",
                value: { [name]: textboxValue },
              });
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.log("EROOR: BindTextBox.setBindValueToStatusParameter");
        console.log(error);
      }
    }

    return (
      <>
        {display ? (
          <>
            {textArea ? (
              <textarea
                ref={textboxRef}
                className="form-control"
                disabled={textboxDisable}
                defaultValue={textboxValue}
                maxLength={maxLength}
                style={
                  style
                    ? Object.assign(
                        {
                          minHeight: "40px",
                          backgroundColor: backColor,
                        },
                        style
                      )
                    : {
                        minHeight: "40px",
                        backgroundColor: backColor,
                      }
                }
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onKeyDown={handleKeyDown}
                draggable={false}
                {...props}
              />
            ) : (
              <input
                type={"text"}
                ref={textboxRef}
                className=" form-control input-rounded"
                disabled={textboxDisable}
                defaultValue={textboxValue}
                style={style}
                maxLength={maxLength}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                {...props}
              />
            )}
          </>
        ) : (
          <None />
        )}
      </>
    );
  }
);
