const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_system_programs_for_admin").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = [
    req.body["programadmin_SYSTEM_UID"]
      ? req.body["programadmin_SYSTEM_UID"]
      : null,
    req.body["programadmin_NODE_LEVEL"]
      ? req.body["programadmin_NODE_LEVEL"]
      : null,
  ];
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_program/get_system_programs_for_admin.sql"
      )
    )
    .toString();
  await lib.requestAPI(
    "/get_system_programs_for_admin",
    DBConfig,
    sql,
    parameter,
    res
  );
});

router.route("/qry_programadim_program_name").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = [req.body["program_uid"] ? req.body["program_uid"] : null];
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_program/qry_programadim_program_name.sql"
      )
    )
    .toString();
  await lib.requestAPI(
    "/qry_programadim_program_name",
    DBConfig,
    sql,
    parameter,
    res
  );
});

router.route("/create_system_program").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};

  let executeList = [];

  executeList.push({
    parameter: [
      req.body["program_uid"] ? req.body["program_uid"] : null,
      req.body["system_uid"] ? req.body["system_uid"] : null,
      req.body["program_code"] ? req.body["program_code"] : null,
      req.body["program_name"] ? req.body["program_name"] : null,
      req.body["i18n"] ? req.body["i18n"] : null,
      req.body["icon"] ? req.body["icon"] : null,
      req.body["path"] ? req.body["path"] : null,
      req.body["parent_uid"] ? req.body["parent_uid"] : null,
      req.body["is_dir"] ? req.body["is_dir"] : null,
      req.body["enabled"] ? req.body["enabled"] : null,
      req.body["node_level"] ? req.body["node_level"] : null,
      req.body["seq"] ? req.body["seq"] : null,
      req.body["access_token"] ? req.body["access_token"] : null,
    ],
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
      [
        req.body["system_uid"] ? req.body["system_uid"] : null,
        req.body["program_uid"] ? req.body["program_uid"] : null,
        "FU-" + lib.uuid(),
        "read",
        req.body["program_name"] ? "讀取-" + req.body["program_name"] : null,
        "讀取",
        "N",
        "Y",
        1,
        req.body["access_token"] ? req.body["access_token"] : null,
      ],
      [
        req.body["system_uid"] ? req.body["system_uid"] : null,
        req.body["program_uid"] ? req.body["program_uid"] : null,
        "FU-" + lib.uuid(),
        "query",
        req.body["program_name"] ? "查詢-" + req.body["program_name"] : null,
        "查詢",
        "N",
        "Y",
        2,
        req.body["access_token"] ? req.body["access_token"] : null,
      ],
      [
        req.body["system_uid"] ? req.body["system_uid"] : null,
        req.body["program_uid"] ? req.body["program_uid"] : null,
        "FU-" + lib.uuid(),
        "create",
        req.body["program_name"] ? "新增-" + req.body["program_name"] : null,
        "新增",
        "N",
        "Y",
        3,
        req.body["access_token"] ? req.body["access_token"] : null,
      ],
      [
        req.body["system_uid"] ? req.body["system_uid"] : null,
        req.body["program_uid"] ? req.body["program_uid"] : null,
        "FU-" + lib.uuid(),
        "update",
        req.body["program_name"] ? "修改-" + req.body["program_name"] : null,
        "修改",
        "N",
        "Y",
        4,
        req.body["access_token"] ? req.body["access_token"] : null,
      ],
      [
        req.body["system_uid"] ? req.body["system_uid"] : null,
        req.body["program_uid"] ? req.body["program_uid"] : null,
        "FU-" + lib.uuid(),
        "delete",
        req.body["program_name"] ? "刪除-" + req.body["program_name"] : null,
        "刪除",
        "N",
        "Y",
        5,
        req.body["access_token"] ? req.body["access_token"] : null,
      ],
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
  await lib.executeAPIs("/create_system_program", DBConfig, executeList, res);
});

router.route("/update_system_program").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = [
    req.body["access_token"] ? req.body["access_token"] : null,
    req.body["program_uid"] ? req.body["program_uid"] : null,
    req.body["program_code"] ? req.body["program_code"] : null,
    req.body["program_name"] ? req.body["program_name"] : null,
    req.body["i18n"] ? req.body["i18n"] : null,
    req.body["icon"] ? req.body["icon"] : null,
    req.body["path"] ? req.body["path"] : null,
    req.body["is_dir"] ? req.body["is_dir"] : null,
    req.body["seq"] ? req.body["seq"] : null,
    req.body["enabled"] ? req.body["enabled"] : null,
  ];
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system_program/update_system_program.sql")
    )
    .toString();
  await lib.executeAPI("/update_system_program", DBConfig, sql, parameter, res);
});

router.route("/delete_system_program").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = [req.body["program_uid"] ? req.body["program_uid"] : null];
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system_program/delete_system_program.sql")
    )
    .toString();
  await lib.executeAPI("/delete_system_program", DBConfig, sql, parameter, res);
});

module.exports = router;
