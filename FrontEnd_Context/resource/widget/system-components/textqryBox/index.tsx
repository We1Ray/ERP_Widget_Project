import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import PublicMethod from "../../../methods/PublicMethod";
import { QryTextQryBox } from "./Qry";
import { BindTextQryBox } from "./Bind";
import { CommonTextQryBox } from "./Common";

/**
 * TextQryBox
 */
interface TextQryBoxProps {
  visible?: boolean;
  disabled?: boolean;
  bind?: boolean;
  query?: boolean;
  name?: string;
  maxLength: number;
  defaultValue?: string;
  handleValidation?: (value: any) => Promise<string>;
  value?: string;
  delimiter?: string;
  dialog: {
    window: any | React.FC<{ callback: any }>;
    parameter?: Object;
    style?: React.CSSProperties;
  };
  label: {
    name: string;
    visible?: boolean;
    api?: string;
    defaultParameters?: object;
    value?: string;
    style?: React.CSSProperties;
  };
  text: {
    name: string;
    visible?: boolean;
    disabled?: boolean;
    style?: React.CSSProperties;
  };
  result?: (
    value: string,
    display: string
  ) => any | ((value: string, display: string) => Promise<any>);
  ref?: React.Ref<any>;
  callbackRef?: (arg: React.MutableRefObject<any>) => void;
  [x: string]: any;
}

const TextQryBox: React.FC<{
  /**
   * 判斷是否可視 初始值為true
   */
  visible?: boolean;
  /**
   * 判斷是否可用 初始值為false
   */
  disabled?: boolean;
  /**
   * 是否為Binding欄位(bind, query擇一)
   */
  bind?: boolean;
  /**
   * 是否為query欄位(bind, query擇一)
   */
  query?: boolean;
  /**
   * 元件名稱
   */
  name?: string;
  /**
   * 值最大長度
   */
  maxLength: number;
  /**
   * 新增時的預設值
   */
  defaultValue?: string;
  /**
   * 設定正規表示式
   */
  handleValidation?: (value: any) => Promise<string>;
  /**
   * 設定給予值
   */
  value?: string;
  /**
   * 多選時的分隔符號
   */
  delimiter?: string;
  /**
   * 開窗
   */
  dialog: {
    /**
     * 畫面
     */
    window: any | React.FC<{ callback: any }>;
    /**
     * 帶入的畫面參數
     */
    parameter?: Object;
    /**
     * 畫面的外觀設定
     */
    style?: React.CSSProperties;
  };
  /**
   * 外顯Label
   */
  label: {
    /**
     * label對應畫面欄位的名稱
     */
    name: string;
    /**
     * Label是否可視 初始值為true
     */
    visible?: boolean;
    /**
     * label查詢的api
     */
    api?: string;
    /**
     * label查詢的api的初始參數
     */
    defaultParameters?: object;
    /**
     * 給予label的值
     */
    value?: string;
    /**
     * 設定外觀
     */
    style?: React.CSSProperties;
  };
  text: {
    /**
     * Textbox欄位對應畫面綁定的名稱
     */
    name: string;
    /**
     * Textbox是否可視 初始值為true
     */
    visible?: boolean;
    /**
     * Textbox是否不可用 初始值為false
     */
    disabled?: boolean;
    /**
     * 設定外觀style
     */
    style?: React.CSSProperties;
  };
  /**
   * 元件回傳目前的值
   */
  result?: (
    value: string,
    display: string
  ) => any | ((value: string, display: string) => Promise<any>);
  /**
   * 元件的Reference
   */
  ref?: React.Ref<any>;
  callbackRef?: (arg: React.MutableRefObject<any>) => void;

  [x: string]: any;
}> = forwardRef(
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
    const textboxRef = useRef(null);

    useImperativeHandle(forwardedRef, () => textboxRef.current);

    useEffect(() => {
      try {
        if (PublicMethod.checkValue(callbackRef)) {
          callbackRef(textboxRef);
        }
      } catch (error) {
        console.log("EROOR: TextQryBox.useEffect()");
        console.log(error);
      }
    });
    return (
      <>
        {query ? (
          <QryTextQryBox
            visible={visible}
            disabled={disabled}
            name={name}
            maxLength={maxLength}
            defaultValue={defaultValue}
            value={value}
            handleValidation={handleValidation}
            delimiter={delimiter}
            dialog={dialog}
            text={text}
            label={label}
            result={result}
            ref={textboxRef}
            {...props}
          />
        ) : bind ? (
          <BindTextQryBox
            visible={visible}
            disabled={disabled}
            name={name}
            maxLength={maxLength}
            defaultValue={defaultValue}
            value={value}
            handleValidation={handleValidation}
            delimiter={delimiter}
            dialog={dialog}
            text={text}
            label={label}
            result={result}
            ref={textboxRef}
            {...props}
          />
        ) : (
          <CommonTextQryBox
            visible={visible}
            disabled={disabled}
            maxLength={maxLength}
            defaultValue={defaultValue}
            value={value}
            handleValidation={handleValidation}
            delimiter={delimiter}
            dialog={dialog}
            text={text}
            label={label}
            result={result}
            ref={textboxRef}
            {...props}
          />
        )}
      </>
    );
  }
);

export { TextQryBox };
export type { TextQryBoxProps };
