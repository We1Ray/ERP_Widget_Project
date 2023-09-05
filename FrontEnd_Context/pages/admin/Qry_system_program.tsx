import React, { useContext, useEffect } from "react";
import {
  Column,
  Tree,
  ProgramContext,
  ProgramProvider,
  Form,
  BtnQuery,
  PublicMethod,
} from "../../resource/index";
import "ds-widget/dist/index.css";

export default function Qry_system_program({ system_uid, callback }) {
  return (
    <ProgramProvider>
      <Qry_system_program_Content system_uid={system_uid} callback={callback} />
    </ProgramProvider>
  );
}

function Qry_system_program_Content({ system_uid, callback }) {
  const { Program } = useContext(ProgramContext);

  function getTreeJsonFromData(treeitem) {
    let result = [];
    let level = { result };
    treeitem.forEach((treeitem) => {
      if (PublicMethod.checkValue(treeitem["program_code"])) {
        treeitem["program_code"].split(".").reduce((r, name, i, a) => {
          if (!r[name]) {
            r[name] = { result: [] };
            r.result.push({
              id: treeitem["program_uid"],
              label: treeitem["program_name"],
              data: treeitem,
              icon: treeitem["icon"],
              children: r[name].result,
            });
          }
          return r[name];
        }, level);
      }
    });
    return result;
  }

  useEffect(() => {
    if (callback) {
      callback(Program.selectedData);
    }
  }, [Program.selectedData]);

  return (
    <>
      <Column md={12}>
        <Form
          program_code="Qry_system_program"
          dataKey={["program_uid", "program_code"]}
          individual={true}
        >
          <BtnQuery
            queryApi="/system_program/get_system_programs_for_admin"
            defaultQueryParameters={{ programadmin_SYSTEM_UID: system_uid }}
            style={{ display: "none" }}
            disableFilter={async () => false}
          />
          <Column>
            <Tree
              bind={true}
              data={getTreeJsonFromData(Program.data)}
              height={300}
            />
          </Column>
        </Form>
      </Column>
    </>
  );
}
