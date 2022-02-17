const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_system_factory").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    SYSTEM_UID: req.body.SYSTEM_UID ? req.body.SYSTEM_UID : null,
    IS_ENABLED: req.body.system_factory_IS_ENABLED
      ? req.body.system_factory_IS_ENABLED
      : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system_factory/get_system_factory.sql")
    )
    .toString();
  await lib.requestAPI("/get_system_factory", DBConfig, sql, parameter, res);
});

router.route("/create_system_factory").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    FACTORY_UID: req.body.FACTORY_UID ? req.body.FACTORY_UID : null,
    SYSTEM_UID: req.body.SYSTEM_UID ? req.body.SYSTEM_UID : null,
    FACTORY_NAME: req.body.FACTORY_NAME ? req.body.FACTORY_NAME : null,
    WS_URL: req.body.WS_URL ? req.body.WS_URL : null,
    WS_DATASOURCE: req.body.WS_DATASOURCE ? req.body.WS_DATASOURCE : null,
    IS_ENABLED: req.body.IS_ENABLED ? req.body.IS_ENABLED : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system_factory/create_system_factory.sql")
    )
    .toString();
  await lib.executeAPI("/create_system_factory", DBConfig, sql, parameter, res);
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
          FACTORY_UID: element.FACTORY_UID ? element.FACTORY_UID : null,
        });
      } catch (error) {
        console.log("error" + error);
      }
    })
  );
  await lib.executeAPI("/delete_system_factory", DBConfig, sql, parameter, res);
});

router.route("/update_system_factory").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    FACTORY_UID: req.body.FACTORY_UID ? req.body.FACTORY_UID : null,
    FACTORY_NAME: req.body.FACTORY_NAME ? req.body.FACTORY_NAME : null,
    WS_URL: req.body.WS_URL ? req.body.WS_URL : null,
    WS_DATASOURCE: req.body.WS_DATASOURCE ? req.body.WS_DATASOURCE : null,
    IS_ENABLED: req.body.IS_ENABLED ? req.body.IS_ENABLED : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system_factory/update_system_factory.sql")
    )
    .toString();
  await lib.executeAPI("/update_system_factory", DBConfig, sql, parameter, res);
});

module.exports = router;
