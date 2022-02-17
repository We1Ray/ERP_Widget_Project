import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import PublicMethod from "../../../methods/PublicMethod";
import { QryTextBox } from "./QryTextBox";
import { BindTextBox } from "./BindTextBox";
import { CommonTextBox } from "./CommonTextBox";
/**
 * TextBox
 * bind和query擇一設定參數
 */
interface TextBoxProps {
  /**
   * 判斷是否可視 初始值為true
   */
  visible?: boolean;
  /**
   * 判斷是否可用 初始值為false
   */
  disabled?: boolean;
  /**
   * 是否為Binding欄位(和query擇一)
   */
  bind?: boolean;
  /**
   * 是否為query欄位(和bind擇一)
   */
  query?: boolean;
  /**
   * 元件名稱
   */
  name?: string;
  /**
   * 值最大長度
   */
  maxLength?: number;
  /**
   * 新增時的預設值
   */
  defaultValue?: string;
  /**
   * 設定給予值
   */
  value?: string;
  /**
   * 設定正規表示式
   */
  handleValidation?: (value: any) => Promise<string>;
  /**
   * 設定是否為TextArea
   */
  area?: boolean;
  /**
   * style外觀設定
   */
  style?: React.CSSProperties;
  /**
   * 元件回傳目前的值
   */
  result?: (value: string) => any;
  /**
   * 元件的Reference
   */
  ref?: React.Ref<any>;
  callbackRef?: (arg: React.MutableRefObject<any>) => void;
}
const TextBox: React.FC<TextBoxProps> = forwardRef(
  (
    {
      visible,
      disabled,
      bind,
      query,
      name,
      maxLength,
      defaultValue,
      value,
      handleValidation,
      area,
      result,
      style,
      callbackRef,
      ...props
    },
    forwardedRef
  ) => {
    const textboxRef = useRef(null);

    useImperativeHandle(forwardedRef, () => textboxRef.current);

    useEffect(() => {
      try {
        if (PublicMethod.checkValue(callbackRef)) {
          callbackRef(textboxRef);
        }
      } catch (error) {
        console.log("EROOR: TextBox.useEffect()");
        console.log(error);
      }
    });

    return (
      <>
        {query ? (
          <QryTextBox
            visible={visible}
            disabled={disabled}
            name={name}
            maxLength={maxLength}
            value={value}
            handleValidation={handleValidation}
            result={result}
            area={area}
            style={style}
            ref={textboxRef}
            {...props}
          />
        ) : bind ? (
          <BindTextBox
            visible={visible}
            disabled={disabled}
            name={name}
            maxLength={maxLength}
            defaultValue={defaultValue}
            value={value}
            handleValidation={handleValidation}
            result={result}
            area={area}
            style={style}
            ref={textboxRef}
            {...props}
          />
        ) : (
          <CommonTextBox
            visible={visible}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            handleValidation={handleValidation}
            result={result}
            area={area}
            style={style}
            ref={textboxRef}
            {...props}
          />
        )}
      </>
    );
  }
);

function getheight(ref: React.MutableRefObject<any>) {
  try {
    ref.current.style.height = "0px";
    const scrollHeight = ref.current.scrollHeight;
    ref.current.style.height = scrollHeight + "px";
  } catch (error) {
    console.log("EROOR: TextBox.getheight");
    console.log(error);
  }
}

function showCurrentValue(ref: React.MutableRefObject<any>, value: string) {
  try {
    if (PublicMethod.checkValue(ref.current)) {
      if (PublicMethod.checkValue(value)) {
        ref.current.value = value;
      } else {
        ref.current.value = "";
      }
    }
  } catch (error) {
    console.log("EROOR: TextBox.showCurrentValue");
    console.log(error);
  }
}
export { TextBox, getheight, showCurrentValue };
export type { TextBoxProps };
