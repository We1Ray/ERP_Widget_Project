const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_system_factory").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    system_factory_IS_ENABLED: req.body["system_factory_IS_ENABLED"]
      ? req.body["system_factory_IS_ENABLED"]
      : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system_factory/get_system_factory.sql")
    )
    .toString();
  await lib.executeSQL(
    "/get_system_factory",
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

router.route("/create_system_factory").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    factory_uid: req.body["factory_uid"] ? req.body["factory_uid"] : null,
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    factory_name: req.body["factory_name"] ? req.body["factory_name"] : null,
    ws_url: req.body["ws_url"] ? req.body["ws_url"] : null,
    ws_datasource: req.body["ws_datasource"] ? req.body["ws_datasource"] : null,
    is_enabled: req.body["is_enabled"] ? req.body["is_enabled"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system_factory/create_system_factory.sql")
    )
    .toString();
  await lib.executeSQL(
    "/create_system_factory",
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

router.route("/delete_system_factory").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system_factory/delete_system_factory.sql")
    )
    .toString();
  let parameter = [];
  await Promise.all(
    req.body.map(async (element) => {
      try {
        parameter.push({
          factory_uid: element["factory_uid"] ? element["factory_uid"] : null,
        });
      } catch (error) {
        console.log("error" + error);
      }
    })
  );
  await lib.executeSQL(
    "/delete_system_factory",
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

router.route("/update_system_factory").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    factory_uid: req.body["factory_uid"] ? req.body["factory_uid"] : null,
    factory_name: req.body["factory_name"] ? req.body["factory_name"] : null,
    ws_url: req.body["ws_url"] ? req.body["ws_url"] : null,
    ws_datasource: req.body["ws_datasource"] ? req.body["ws_datasource"] : null,
    is_enabled: req.body["is_enabled"] ? req.body["is_enabled"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system_factory/update_system_factory.sql")
    )
    .toString();
  await lib.executeSQL(
    "/update_system_factory",
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
