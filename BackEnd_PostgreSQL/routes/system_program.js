const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_system_programs_for_admin").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    programadmin_SYSTEM_UID: req.body["programadmin_SYSTEM_UID"]
      ? req.body["programadmin_SYSTEM_UID"]
      : null,
    programadmin_NODE_LEVEL: req.body["programadmin_NODE_LEVEL"]
      ? req.body["programadmin_NODE_LEVEL"]
      : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_program/get_system_programs_for_admin.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/get_system_programs_for_admin",
    DBConfig,
    sql,
    parameter,
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/qry_programadim_program_name").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    program_uid: req.body["program_uid"] ? req.body["program_uid"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_program/qry_programadim_program_name.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/qry_programadim_program_name",
    DBConfig,
    sql,
    parameter,
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/create_system_program").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};

  let executeList = [];

  executeList.push({
    parameter: {
      program_uid: req.body["program_uid"] ? req.body["program_uid"] : null,
      system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
      program_code: req.body["program_code"] ? req.body["program_code"] : null,
      program_name: req.body["program_name"] ? req.body["program_name"] : null,
      i18n: req.body["i18n"] ? req.body["i18n"] : null,
      icon: req.body["icon"] ? req.body["icon"] : null,
      path: req.body["path"] ? req.body["path"] : null,
      parent_uid: req.body["parent_uid"] ? req.body["parent_uid"] : null,
      is_dir: req.body["is_dir"] ? req.body["is_dir"] : null,
      enabled: req.body["enabled"] ? req.body["enabled"] : null,
      node_level: req.body["node_level"] ? req.body["node_level"] : null,
      seq: req.body["seq"] ? req.body["seq"] : null,
      access_token: req.body["access_token"] ? req.body["access_token"] : null,
    },
    sql: fs
      .readFileSync(
        path.resolve(
          __dirname,
          "../sql/system_program/create_system_program.sql"
        )
      )
      .toString(),
  });

  executeList.push({
    parameter: [
      {
        system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
        program_uid: req.body["program_uid"] ? req.body["program_uid"] : null,
        function_uid: "FU-" + lib.uuid(),
        function_code: "read",
        function_name: req.body["program_name"]
          ? "讀取-" + req.body["program_name"]
          : null,
        function_desc: "讀取",
        is_core: "N",
        enabled: "Y",
        seq: 1,
        access_token: req.body["access_token"]
          ? req.body["access_token"]
          : null,
      },
      {
        system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
        program_uid: req.body["program_uid"] ? req.body["program_uid"] : null,
        function_uid: "FU-" + lib.uuid(),
        function_code: "query",
        function_name: req.body["program_name"]
          ? "查詢-" + req.body["program_name"]
          : null,
        function_desc: "查詢",
        is_core: "N",
        enabled: "Y",
        seq: 2,
        access_token: req.body["access_token"]
          ? req.body["access_token"]
          : null,
      },
      {
        system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
        program_uid: req.body["program_uid"] ? req.body["program_uid"] : null,
        function_uid: "FU-" + lib.uuid(),
        function_code: "create",
        function_name: req.body["program_name"]
          ? "新增-" + req.body["program_name"]
          : null,
        function_desc: "新增",
        is_core: "N",
        enabled: "Y",
        seq: 3,
        access_token: req.body["access_token"]
          ? req.body["access_token"]
          : null,
      },
      {
        system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
        program_uid: req.body["program_uid"] ? req.body["program_uid"] : null,
        function_uid: "FU-" + lib.uuid(),
        function_code: "update",
        function_name: req.body["program_name"]
          ? "修改-" + req.body["program_name"]
          : null,
        function_desc: "修改",
        is_core: "N",
        enabled: "Y",
        seq: 4,
        access_token: req.body["access_token"]
          ? req.body["access_token"]
          : null,
      },
      {
        system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
        program_uid: req.body["program_uid"] ? req.body["program_uid"] : null,
        function_uid: "FU-" + lib.uuid(),
        function_code: "delete",
        function_name: req.body["program_name"]
          ? "刪除-" + req.body["program_name"]
          : null,
        function_desc: "刪除",
        is_core: "N",
        enabled: "Y",
        seq: 5,
        access_token: req.body["access_token"]
          ? req.body["access_token"]
          : null,
      },
    ],
    sql: fs
      .readFileSync(
        path.resolve(
          __dirname,
          "../sql/system_program_function/create_system_program_function.sql"
        )
      )
      .toString(),
  });
  await lib.executeSQLs(
    "/create_system_program",
    DBConfig,
    executeList,
    (response) => {
      res.send(response);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/update_system_program").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
    program_uid: req.body["program_uid"] ? req.body["program_uid"] : null,
    program_code: req.body["program_code"] ? req.body["program_code"] : null,
    program_name: req.body["program_name"] ? req.body["program_name"] : null,
    i18n: req.body["i18n"] ? req.body["i18n"] : null,
    icon: req.body["icon"] ? req.body["icon"] : null,
    path: req.body["path"] ? req.body["path"] : null,
    is_dir: req.body["is_dir"] ? req.body["is_dir"] : null,
    seq: req.body["seq"] ? req.body["seq"] : null,
    enabled: req.body["enabled"] ? req.body["enabled"] : null,
  };

  let codes = parameter.program_code.split(".");

  parameter.node_level = codes.length;

  let parendCode = "";
  if (parameter.node_level > 1) {
    for (let i = 0; i < codes.length - 1; i++) {
      parendCode += codes[i] + ".";
    }
    parendCode = parendCode.substring(0, parendCode.length - 1);
  }

  let parendParameter = {
    program_code: parendCode,
  };

  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_program/qry_programadim_program_by_code.sql"
      )
    )
    .toString();

    
  await lib.executeSQL(
    "/update_system_program",
    DBConfig,
    sql,
    parendParameter,
    (response) => {
      if (parameter.node_level > 1) {
        if (
          response.rows.length === 1 &&
          response.rows[0].program_uid !== parameter.program_uid
        ) {
          parameter.parent_uid = response.rows[0].program_uid;

          sql = fs
            .readFileSync(
              path.resolve(
                __dirname,
                "../sql/system_program/update_system_program.sql"
              )
            )
            .toString();

          lib.executeSQL(
            "/update_system_program",
            DBConfig,
            sql,
            parameter,
            (response) => {
              res.send(response);
            },
            (error) => {
              res.status(400).json({ error: error });
            }
          );
        } else {
          res.status(400).json({ error: true, message: "資料有誤" });
        }
      } else {

        parameter.parent_uid = '';


        sql = fs
            .readFileSync(
              path.resolve(
                __dirname,
                "../sql/system_program/update_system_program.sql"
              )
            )
            .toString();

        lib.executeSQL(
          "/update_system_program",
          DBConfig,
          sql,
          parameter,
          (response) => {
            res.send(response);
          },
          (error) => {
            res.status(400).json({ error: error });
          }
        );
      }
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/delete_system_program").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    program_uid: req.body["program_uid"] ? req.body["program_uid"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system_program/delete_system_program.sql")
    )
    .toString();
  await lib.executeSQL(
    "/delete_system_program",
    DBConfig,
    sql,
    parameter,
    (response) => {
      res.send(response);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

module.exports = router;
