import React, { useState, useEffect, useContext } from "react";
import { Button } from "reactstrap";
import { SystemContext } from "../system-control/SystemContext";
import {
  ProgramContext,
  statusContext,
  STATUS,
} from "../system-control/ProgramContext";
import PublicMethod from "../../methods/PublicMethod";
interface Props {
  /**
   * 設定是否可使用
   */
  disableFilter?: () => Promise<boolean>;
  /**
   * 設定外觀
   */
  style?: React.CSSProperties;
  /**
   * 設定其他畫面顯示
   */
  childObject?: React.AllHTMLAttributes<any>;
}
/**
 * BtnSave 儲存按鈕，按下後會改變狀態讓資料儲存
 */
export const BtnSave: React.FC<Props> = ({
  disableFilter,
  style,
  childObject,
}) => {
  const { System } = useContext(SystemContext);
  const { Program } = useContext(ProgramContext);
  const { status, send } = useContext(statusContext);
  const [saveDisable, setSaveDisable] = useState(true);
  const [savePermission, setSavePermission] = useState(false);

  useEffect(() => {
    disable();
  }, [disableFilter, JSON.stringify(Program.validation["bind"])]);

  async function disable() {
    try {
      if (PublicMethod.checkValue(disableFilter)) {
        setSavePermission(
          !(
            PublicMethod.checkValue(Program.validation["bind"]) ||
            (await disableFilter())
          )
        );
      } else {
        setSavePermission(!PublicMethod.checkValue(Program.validation["bind"]));
      }
    } catch (error) {
      console.log("EROOR: BtnSave.disable");
      console.log(error);
    }
  }

  useEffect(() => {
    let latest = true;
    async function checkEnable() {
      try {
        if (latest) {
          if (status.matches(STATUS.CREATE) || status.matches(STATUS.UPDATE)) {
            setSaveDisable(!savePermission);
          } else {
            setSaveDisable(true);
          }
        }
      } catch (error) {
        console.log("EROOR: BtnSave.checkEnable");
        console.log(error);
      }
    }
    checkEnable();
    return () => {
      latest = false;
    };
  }, [savePermission, status]);

  return (
    <Button
      style={style}
      color="success"
      disabled={saveDisable}
      onClick={() => send(STATUS.SAVE)}
    >
      {PublicMethod.checkValue(childObject) ? (
        childObject
      ) : (
        <>
          <em className={"far fa-save"} />
          &ensp;
          {System.getLocalization("Public", "Save")}
        </>
      )}
    </Button>
  );
};
