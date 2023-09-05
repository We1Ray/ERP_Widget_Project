import React, { useContext, useEffect } from "react";
import { Card, ButtonToolbar } from "reactstrap";
import {
  Row,
  Column,
  DataTable,
  Label,
  TextBox,
  ProgramContext,
  ProgramProvider,
  SystemContext,
  Form,
  BtnQuery,
} from "../../resource/index";
import "ds-widget/dist/index.css";

export default function Qry_accounts_not_in_system({ system_uid, callback }) {
  return (
    <ProgramProvider>
      <Qry_accounts_not_in_system_Content
        system_uid={system_uid}
        callback={callback}
      />
    </ProgramProvider>
  );
}

function Qry_accounts_not_in_system_Content({ system_uid, callback }) {
  const { System } = useContext(SystemContext);
  const { Program } = useContext(ProgramContext);

  useEffect(() => {
    if (callback) {
      callback(Program.selectedData);
    }
  }, [Program.selectedData]);

  return (
    <Form
      program_code="Qry_accounts"
      dataKey={["account_uid"]}
      individual={true}
    >
      <Column md={12}>
        <Row>
          <Column md={12}>
            <ButtonToolbar>
              <BtnQuery
                queryApi="/system_administrator/get_accounts_not_in_system"
                disableFilter={async () => false}
                defaultQueryParameters={{
                  system_uid: system_uid,
                }}
              />
            </ButtonToolbar>
          </Column>
          <Column>
            <Label
              text={System.getLocalization("system_administrator", "ACCOUNT")}
            />
            <TextBox
              maxLength={20}
              query={true}
              name="account_not_in_system_KEY"
            />
          </Column>
        </Row>
      </Column>
      <Column md={12}>
        <Column>
          <DataTable
            bind={true}
            data={Program.data}
            columns={[
              {
                dataField: "account_uid",
                text: System.getLocalization("system_administrator", "ACCOUNT"),
                sort: true,
                hidden: true,
              },
              {
                dataField: "account",
                text: System.getLocalization("system_administrator", "ACCOUNT"),
                sort: true,
              },
              {
                dataField: "name",
                text: System.getLocalization("system_administrator", "NAME"),
                sort: true,
              },
            ]}
          />
        </Column>
      </Column>
    </Form>
  );
}
