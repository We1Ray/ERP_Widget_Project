import React, { useEffect, useContext } from "react";
import {
  SystemContext,
  ComponentProvider,
  ProgramProvider,
} from "../../resource/index";

export default function Org() {
  return (
    <ComponentProvider>
      <ProgramProvider>
        <Org_Content />
      </ProgramProvider>
    </ComponentProvider>
  );
}

function Org_Content() {
  const { System, SystemDispatch } = useContext(SystemContext);

  useEffect(() => {
    SystemDispatch({ type: "mustlogin", value: false });
  }, []);

  return <div>123</div>;
}
