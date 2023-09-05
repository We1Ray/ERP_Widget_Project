import React from "react";
import { BindBtnFileUpload } from "./Bind";
import { CommonBtnFileUpload } from "./Common";

interface BtnFileUploadProps {
  /**
   * 是否為Binding欄位
   */
  bind?: boolean;
  /**
   * 是否點選檔案後即上傳檔案
   */
  immediatelyUpload?: boolean;
  /**
   * 設定是否可使用
   */
  disableFilter?: () => Promise<boolean>;
  /**
   * 覆寫上傳功能
   */
  doUpload?: (event: File[] | FileList) => Promise<void>;
  /**
   * 設定外觀
   */
  style?: React.CSSProperties;
  /**
   * 設定其他畫面顯示
   */
  childObject?: React.AllHTMLAttributes<any>;
  /**
   * 按下按鈕時觸發(觸發後會改變狀態)
   */
  onClick?: () => Promise<any>;
  /**
   * 滑鼠移動至按鈕顯示的字眼
   */
  title?: string;

  multiple?: boolean;

  /**
   * 元件名稱
   */
  name?: string;

  /**
   * 判斷是否可視 初始值為true
   */
  visible?: boolean;

  /**
   * 元件回傳目前的值
   */
  result?: (
    value: string,
    text: string
  ) => any | ((value: string, text: string) => Promise<any>);
  /**
   * 元件的Reference
   */
  ref?: React.Ref<any>;
}

/**
 * BtnFileUpload 檔案上傳按鈕
 */
const BtnFileUpload: React.FC<BtnFileUploadProps> = ({
  bind,
  immediatelyUpload,
  style,
  disableFilter,
  doUpload,
  childObject,
  onClick,
  title,
  multiple,
  name,
  visible,
  result,
  ref,
  ...props
}) => {
  return (
    <>
      {bind ? (
        <BindBtnFileUpload
          immediatelyUpload={immediatelyUpload}
          style={style}
          name={name}
          disableFilter={disableFilter}
          doUpload={doUpload}
          childObject={childObject}
          onClick={onClick}
          title={title}
          multiple={multiple}
          visible={visible}
          result={result}
          ref={ref}
          {...props}
        />
      ) : (
        <CommonBtnFileUpload
          immediatelyUpload={immediatelyUpload}
          style={style}
          disableFilter={disableFilter}
          doUpload={doUpload}
          childObject={childObject}
          onClick={onClick}
          title={title}
          multiple={multiple}
          visible={visible}
          result={result}
          ref={ref}
          {...props}
        />
      )}
    </>
  );
};

export { BtnFileUpload };
export type { BtnFileUploadProps };
