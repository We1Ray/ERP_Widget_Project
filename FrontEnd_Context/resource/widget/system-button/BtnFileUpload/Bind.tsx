import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  forwardRef,
} from "react";
import { Button, CustomInput } from "reactstrap";
import { SystemContext } from "../../system-control/SystemContext";
import { ComponentContext } from "../../system-control/ComponentContext";
import {
  ProgramContext,
  statusContext,
  STATUS,
} from "../../system-control/ProgramContext";
import useSysBtnEnable from "../hooks/useSysBtnEnable";
import PublicMethod from "../../../methods/PublicMethod";
import { BtnFileUploadProps } from "./index";
import { Row } from "../../system-ui/Row";
import { Column } from "../../system-ui/Column";
import { None } from "../../system-ui/None";

export const BindBtnFileUpload: React.FC<BtnFileUploadProps> = forwardRef(
  (
    {
      style,
      disableFilter,
      immediatelyUpload = false,
      doUpload,
      childObject,
      onClick,
      title,
      multiple,
      visible,
      result,
      ref,
      name,
      ...props
    },
    forwardedRef
  ) => {
    const { System } = useContext(SystemContext);
    const { Program, ProgramDispatch } = useContext(ProgramContext);
    const { status } = useContext(statusContext);
    const [uploadDisable, setUploadDisable] = useState(true);
    const [fileList, setFileList] = useState<File[]>([]);
    const hiddenFileInput = useRef(null);

    const handleClick = async (event: any) => {
      if (onclick) await onClick();
      await hiddenFileInput.current.click();
    };

    /** Bind useEffect */
    useEffect(() => {
      checkStatus();
    }, [status, disabled]);

    /**當查詢資料變更時的動作*/
    useEffect(() => {
      bindData();
    }, [JSON.stringify(Program.selectedData[name])]);

    /** 確認目前作業狀態後更改欄位狀態 */
    function checkStatus() {
      try {
        switch (status.value) {
          case STATUS.READ:
            bindData();
            setCheckboxDisable(true);
            break;
          case STATUS.CREATE:
            checkDisable();
            if (PublicMethod.checkValue(defaultValue)) {
              //給予預設值
              setChecked(defaultValue == checkedValue);
            } else {
              setChecked(false);
            }
            break;
          case STATUS.UPDATE:
            if (Program.dataKey.indexOf(name) > -1) {
              //設定Key值不可編輯
              setCheckboxDisable(true);
            } else {
              checkDisable();
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.log("EROOR: BindCheckBox.checkStatus");
        console.log(error);
      }
    }

    /** 判斷欄位是否禁用*/
    function checkDisable() {
      try {
        if (PublicMethod.checkValue(disabled)) {
          setCheckboxDisable(disabled);
        } else {
          setCheckboxDisable(false);
        }
      } catch (error) {
        console.log("EROOR: BindCheckBox.checkDisable");
        console.log(error);
      }
    }

    async function disable() {
      try {
        if (PublicMethod.checkValue(disableFilter)) {
          setUploadDisable(!(await disableFilter()));
        } else {
          setUploadDisable(false);
        }
      } catch (error) {
        console.log("EROOR: CommonBtnFileUpload.disable");
        console.log(error);
      }
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFileList(
        e.target.files ? [...fileList, ...e.target.files] : [...fileList]
      );
    };

    const deleteTempFile = async (index) => {
      let temp = [...fileList];
      temp.splice(index, 1);
      setFileList(temp);
    };

    function numberComma(number) {
      return (number + "").replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }

    /**資料變更後若有選定的資料則顯示*/
    function bindData() {
      try {
        if (!status.matches(STATUS.CREATE)) {
          if (PublicMethod.checkValue(Program.data)) {
            //若有資料則綁定
            setChecked(Program.selectedData[name] == checkedValue);
          } else {
            setChecked(false);
          }
        }
      } catch (error) {
        console.log("EROOR: BindCheckBox.bindData");
        console.log(error);
      }
    }

    return (
      <>
        {immediatelyUpload ? (
          <Button
            style={style}
            disabled={uploadDisable}
            onClick={handleClick}
            title={title}
          >
            {PublicMethod.checkValue(childObject) ? (
              childObject
            ) : (
              <>
                <em className={"far fa-file"} />
                &ensp;
                {System.getLocalization("Public", "ImportExcel")}
              </>
            )}
            <input
              ref={hiddenFileInput}
              type="file"
              multiple={multiple}
              id="upload-button"
              disabled={uploadDisable}
              style={{ display: "none" }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                doUpload(event.target.files);
              }}
            />
          </Button>
        ) : (
          <>
            <Row>
              <Column lg="12">
                <CustomInput
                  disabled={uploadDisable}
                  type="file"
                  customControlLabel={"111"}
                  label={""}
                  name="customFile"
                  onChange={onFileChange}
                  className="clickable"
                  multiple={multiple}
                />
              </Column>
            </Row>
            {fileList.length > 0 ? (
              <div className="mt-4 p-3" style={{ backgroundColor: "#C9EEFF" }}>
                <h4 className="mt-2 pl-3">
                  {System.getLocalization("WorkBoard", "FILE_TO_BE_UPLOADED")}
                </h4>
                <Row>
                  <Column lg="10">
                    {fileList.map((file, index) => (
                      <div
                        className="list-group-item"
                        style={{ backgroundColor: "#C9EEFF" }}
                      >
                        <span className="badge badge-green float-right">
                          <small>
                            {file["size"] > 1024
                              ? numberComma(Math.round(file["size"] / 1024)) +
                                " KB"
                              : file["size"] + " byte"}{" "}
                          </small>
                        </span>
                        <em
                          className="fa-fw fa fa-trash mr-2 text-danger clickable"
                          onClick={() => {
                            deleteTempFile(index);
                          }}
                        />
                        <span className="px-4">{file["name"]}</span>
                      </div>
                    ))}
                  </Column>
                  <Column lg="2">
                    <Button
                      color="success"
                      onClick={() => {
                        doUpload(fileList);
                      }}
                      disabled={uploadDisable}
                    >
                      <em className="fa fa-save"></em>
                      &ensp;
                      {System.getLocalization("Public", "UPLOAD")}
                    </Button>
                  </Column>
                </Row>
              </div>
            ) : (
              <None />
            )}
          </>
        )}
      </>
    );
  }
);
