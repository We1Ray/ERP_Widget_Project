import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import PublicMethod from "../../../methods/PublicMethod";
import { Input } from "reactstrap";
import "./CheckBox.scss";
import { None } from "../../system-ui/None";
import { CheckBoxProps } from "./CheckBox";

export const CommonCheckBox: React.FC<CheckBoxProps> = forwardRef(
  (
    {
      visible,
      disabled,
      value,
      checkedText,
      notCheckedText,
      checkedValue,
      notCheckedValue,
      result,
      callbackRef,
      ...props
    },
    forwardedRef
  ) => {
    const [checked, setChecked] = useState(
      PublicMethod.checkValue(value) ? value == checkedValue : false
    );
    const [checkboxText, setCheckboxText] = useState(
      PublicMethod.checkValue(value)
        ? value == checkedValue
          ? checkedText
          : notCheckedText
        : notCheckedText
    );
    const [checkboxDisable, setCheckboxDisable] = useState(false);
    const [display, setDisplay] = useState(true);
    const checkboxRef = useRef(null);

    useImperativeHandle(forwardedRef, () => checkboxRef.current);

    useEffect(() => {
      try {
        if (PublicMethod.checkValue(callbackRef)) {
          callbackRef(checkboxRef);
        }
      } catch (error) {
        console.log("EROOR: CommonCheckBox.useEffect()");
        console.log(error);
      }
    });

    useEffect(() => {
      try {
        if (PublicMethod.checkValue(visible)) {
          setDisplay(visible);
        }
      } catch (error) {
        console.log("EROOR: CommonCheckBox.useEffect[visible]");
        console.log(error);
      }
    }, [visible]);

    useEffect(() => {
      try {
        if (checked) {
          setCheckboxText(checkedText);
          if (result) {
            result(checkedValue);
          }
        } else {
          setCheckboxText(notCheckedText);
          if (result) {
            result(notCheckedValue);
          }
        }
      } catch (error) {
        console.log("EROOR: CommonCheckBox.useEffect[checked]");
        console.log(error);
      }
    }, [checked]);

    useEffect(() => {
      try {
        if (value !== undefined) {
          setChecked(value === checkedValue);
        }
      } catch (error) {
        console.log("EROOR: CommonCheckBox.useEffect[defaultValue]");
        console.log(error);
      }
    }, [value]);

    useEffect(() => {
      try {
        checkDisable();
      } catch (error) {
        console.log("EROOR: CommonCheckBox.useEffect[disable]");
        console.log(error);
      }
    }, [disabled]);

    /** 判斷欄位是否禁用*/
    function checkDisable() {
      try {
        if (PublicMethod.checkValue(disabled)) {
          setCheckboxDisable(disabled);
        } else {
          setCheckboxDisable(false);
        }
      } catch (error) {
        console.log("EROOR: CommonCheckBox.checkDisable");
        console.log(error);
      }
    }

    function handleChange(e) {
      try {
        setChecked(e.target.checked);
      } catch (error) {
        console.log("EROOR: CommonCheckBox.handleChange");
        console.log(error);
      }
    }

    return (
      <>
        {display ? (
          <label className="c-checkbox" {...props}>
            <div className="input-group">
              <Input
                ref={checkboxRef}
                type="checkbox"
                disabled={checkboxDisable}
                defaultChecked={checked}
                checked={checked}
                onChange={handleChange}
              />
              <span className="fa fa-check" />
              <p>{checkboxText}</p>
            </div>
          </label>
        ) : (
          <None />
        )}
      </>
    );
  }
);
