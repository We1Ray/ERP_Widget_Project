import React, { useContext, useEffect } from "react";
import {
  Column,
  Tree,
  ProgramContext,
  ProgramProvider,
  Form,
  BtnQuery,
} from "../../resource/index";
import "ds-widget/dist/index.css";

export default function Qry_group_list_for_admin({ callback }) {
  return (
    <ProgramProvider>
      <Qry_group_list_for_admin_Content callback={callback} />
    </ProgramProvider>
  );
}

function Qry_group_list_for_admin_Content({ callback }) {
  const { Program } = useContext(ProgramContext);

  function treedata(list, parent = "") {
    let parentObj = {};
    list.forEach((o) => {
      parentObj[o.id] = o;
    });
    if (!parent) {
      return list
        .filter((o) => !parentObj[o.parent])
        .map((o) => ((o.children = treedata(list, o.id)), o));
    } else {
      return list
        .filter((o) => o.parent == parent)
        .map((o) => ((o.children = treedata(list, o.id)), o));
    }
  }

  function getTree() {
    let treelist = [];
    for (let index = 0; index < Program.data.length; index++) {
      treelist.push({
        id: Program.data[index]["group_uid"],
        label: Program.data[index]["group_name"],
        data: Program.data[index],
        parent: Program.data[index]["parent_group_uid"],
      });
    }
    return treedata(treelist);
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
          program_code="Qry_group_list_for_admin"
          dataKey={["group_uid"]}
          individual={true}
        >
          <BtnQuery
            queryApi="/group/get_group_list_for_admin"
            style={{ display: "none" }}
            disableFilter={async () => false}
          />
          <Column>
            <Tree bind={true} data={getTree()} height={300} />
          </Column>
        </Form>
      </Column>
    </>
  );
}
