import React, { useState, useEffect, useContext } from "react";
import { Button } from "reactstrap";
import { useSystem } from "../system-control/systemReducer";
import {
  ProgramContext,
  statusContext,
  STATUS,
} from "../system-control/ProgramContext";
import PublicMethod from "../../methods/PublicMethod";
interface Props {
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
 * BtnCancel 取消按鈕，按下後會改變狀態為Read
 */
export const BtnCancel: React.FC<Props> = ({ style, childObject }) => {
  const { System } = useSystem();
  const { Program, ProgramDispatch } = useContext(ProgramContext);
  const { status, send } = useContext(statusContext);
  const [CancelDisable, setCancelDisable] = useState(true);

  useEffect(() => {
    switch (status.value) {
      case STATUS.CREATE:
        setCancelDisable(false);
        break;
      case STATUS.UPDATE:
        setCancelDisable(false);
        break;
      case STATUS.CANCEL:
        ProgramDispatch({ type: "insertParameters", value: null });
        ProgramDispatch({ type: "updateParameters", value: null });
        send(STATUS.READ);
      case STATUS.READ:
        ProgramDispatch({ type: "insertParameters", value: null });
        ProgramDispatch({ type: "updateParameters", value: null });
        setCancelDisable(true);
        break;
      default:
        setCancelDisable(true);
        break;
    }
  }, [status]);

  return (
    <Button
      style={style}
      disabled={CancelDisable}
      onClick={() => send(STATUS.CANCEL)}
    >
      {PublicMethod.checkValue(childObject) ? (
        childObject
      ) : (
        <>
          <em className={"fas fa-ban"} />
          &ensp;
          {System.getLocalization("Public", "Cancel")}
        </>
      )}
    </Button>
  );
};
