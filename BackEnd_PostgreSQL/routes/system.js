const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_account_available_systems").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    systemadmin_ACCOUNT_UID: req.body["systemadmin_ACCOUNT_UID"]
      ? req.body["systemadmin_ACCOUNT_UID"]
      : null,
    systemadmin_ACCESS_TOKEN: req.body["systemadmin_ACCESS_TOKEN"]
      ? req.body["systemadmin_ACCESS_TOKEN"]
      : null,
    systemadmin_SYSTEM_NAME: req.body["systemadmin_SYSTEM_NAME"]
      ? req.body["systemadmin_SYSTEM_NAME"]
      : null,
    systemadmin_SYSTEM_TYPE: req.body["systemadmin_SYSTEM_TYPE"]
      ? req.body["systemadmin_SYSTEM_TYPE"]
      : null,
    systemadmin_SYSTEM_UID: req.body["systemadmin_SYSTEM_UID"]
      ? req.body["systemadmin_SYSTEM_UID"]
      : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system/get_account_available_systems.sql")
    )
    .toString();
  await lib.executeSQL(
    "/get_account_available_systems",
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

router.route("/get_system_type_list").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system/get_system_type_list.sql")
    )
    .toString();
  await lib.executeSQL(
    "/get_system_type_list",
    DBConfig,
    sql,
    {},
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/create_system").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};

  let executeList = [];

  executeList.push({
    parameter: {
      system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
      system_name: req.body["system_name"] ? req.body["system_name"] : null,
      system_desc: req.body["system_desc"] ? req.body["system_desc"] : null,
      secret_key: req.body["secret_key"] ? req.body["secret_key"] : null,
      enabled: req.body["enabled"] ? req.body["enabled"] : null,
      system_type: req.body["system_type"] ? req.body["system_type"] : null,
      access_token: req.body["access_token"] ? req.body["access_token"] : null,
    },
    sql: fs
      .readFileSync(path.resolve(__dirname, "../sql/system/create_system.sql"))
      .toString(),
  });

  executeList.push({
    parameter: {
      system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
      access_token: req.body["access_token"] ? req.body["access_token"] : null,
    },
    sql: fs
      .readFileSync(
        path.resolve(
          __dirname,
          "../sql/system/create_system_available_user.sql"
        )
      )
      .toString(),
  });

  await lib.executeSQLs(
    "/create_system",
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

router.route("/update_system").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    system_name: req.body["system_name"] ? req.body["system_name"] : null,
    system_desc: req.body["system_desc"] ? req.body["system_desc"] : null,
    enabled: req.body["enabled"] ? req.body["enabled"] : null,
    system_type: req.body["system_type"] ? req.body["system_type"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/system/update_system.sql"))
    .toString();
  await lib.executeSQL(
    "/update_system",
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

router.route("/get_system_info").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};

  let parameter = {
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
  }

  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system/get_system_info.sql")
    )
    .toString();
  await lib.executeSQL(
    "/get_system_info",
    DBConfig,
    sql,
    parameter,
    (response) => {
      if(response.rows.length > 0) {
        res.send(response.rows[0]);
      } else {
        res.send({});
      }
      
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});


module.exports = router;
