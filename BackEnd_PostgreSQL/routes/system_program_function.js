const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_system_program_functions").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = [
    req.body["functionadmin_PROGRAM_UID"]
      ? req.body["functionadmin_PROGRAM_UID"]
      : null,
    req.body["functionadmin_SYSTEM_UID"]
      ? req.body["functionadmin_SYSTEM_UID"]
      : null,
  ];
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_program_function/get_system_program_functions.sql"
      )
    )
    .toString();
  await lib.requestAPI(
    "/get_system_program_functions",
    DBConfig,
    sql,
    parameter,
    res
  );
});

router.route("/create_system_program_function").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = [
    req.body["system_uid"] ? req.body["system_uid"] : null,
    req.body["program_uid"] ? req.body["program_uid"] : null,
    req.body["function_uid"] ? req.body["function_uid"] : null,
    req.body["function_code"] ? req.body["function_code"] : null,
    req.body["function_name"] ? req.body["function_name"] : null,
    req.body["function_desc"] ? req.body["function_desc"] : null,
    req.body["is_core"] ? req.body["is_core"] : null,
    req.body["enabled"] ? req.body["enabled"] : null,
    req.body["seq"] ? req.body["seq"] : null,
    req.body["access_token"] ? req.body["access_token"] : null,
  ];
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_program_function/create_system_program_function.sql"
      )
    )
    .toString();
  await lib.executeAPI(
    "/create_system_program_function",
    DBConfig,
    sql,
    parameter,
    res
  );
});

router.route("/update_system_program_function").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = [
    req.body["access_token"] ? req.body["access_token"] : null,
    req.body["function_uid"] ? req.body["function_uid"] : null,
    req.body["function_name"] ? req.body["function_name"] : null,
    req.body["function_desc"] ? req.body["function_desc"] : null,
    req.body["function_code"] ? req.body["function_code"] : null,
    req.body["is_core"] ? req.body["is_core"] : null,
    req.body["enabled"] ? req.body["enabled"] : null,
    req.body["seq"] ? req.body["seq"] : null,
  ];
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_program_function/update_system_program_function.sql"
      )
    )
    .toString();
  await lib.executeAPI(
    "/update_system_program_function",
    DBConfig,
    sql,
    parameter,
    res
  );
});

router.route("/delete_system_program_function").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_program_function/delete_system_program_function.sql"
      )
    )
    .toString();
  if (Array.isArray(req.body)) {
    let parameter = [];
    await Promise.all(
      req.body.map(async (element) => {
        try {
          parameter.push([
            element["function_uid"] ? element["function_uid"] : null,
          ]);
        } catch (error) {
          console.log("error" + error);
        }
      })
    );
    await lib.executeAPI(
      "/delete_system_program_function",
      DBConfig,
      sql,
      parameter,
      res
    );
  } else {
    let parameter = [
      req.body["function_uid"] ? req.body["function_uid"] : null,
    ];
    await lib.executeAPI(
      "/delete_system_program_function",
      DBConfig,
      sql,
      parameter,
      res
    );
  }
});

module.exports = router;
