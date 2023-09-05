const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_system_program_functions").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    functionadmin_PROGRAM_UID: req.body["functionadmin_PROGRAM_UID"]
      ? req.body["functionadmin_PROGRAM_UID"]
      : null,
    functionadmin_SYSTEM_UID: req.body["functionadmin_SYSTEM_UID"]
      ? req.body["functionadmin_SYSTEM_UID"]
      : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_program_function/get_system_program_functions.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/get_system_program_functions",
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

router.route("/create_system_program_function").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    program_uid: req.body["program_uid"] ? req.body["program_uid"] : null,
    function_uid: req.body["function_uid"] ? req.body["function_uid"] : null,
    function_code: req.body["function_code"] ? req.body["function_code"] : null,
    function_name: req.body["function_name"] ? req.body["function_name"] : null,
    function_desc: req.body["function_desc"] ? req.body["function_desc"] : null,
    is_core: req.body["is_core"] ? req.body["is_core"] : null,
    enabled: req.body["enabled"] ? req.body["enabled"] : null,
    seq: req.body["seq"] ? req.body["seq"] : null,
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_program_function/create_system_program_function.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/create_system_program_function",
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

router.route("/update_system_program_function").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
    function_uid: req.body["function_uid"] ? req.body["function_uid"] : null,
    function_name: req.body["function_name"] ? req.body["function_name"] : null,
    function_desc: req.body["function_desc"] ? req.body["function_desc"] : null,
    function_code: req.body["function_code"] ? req.body["function_code"] : null,
    is_core: req.body["is_core"] ? req.body["is_core"] : null,
    enabled: req.body["enabled"] ? req.body["enabled"] : null,
    seq: req.body["seq"] ? req.body["seq"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_program_function/update_system_program_function.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/update_system_program_function",
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
          parameter.push({
            function_uid: element["function_uid"]
              ? element["function_uid"]
              : null,
          });
        } catch (error) {
          console.log("error" + error);
        }
      })
    );
  } else {
    parameter = {
      function_uid: req.body["function_uid"] ? req.body["function_uid"] : null,
    };
  }
  await lib.executeSQL(
    "/delete_system_program_function",
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
