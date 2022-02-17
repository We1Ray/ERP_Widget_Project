const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_account_available_menu").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = [
    req.body["account_uid"] ? req.body["account_uid"] : null,
    req.body["access_token"] ? req.body["access_token"] : null,
    req.body["factory_uid"] ? req.body["factory_uid"] : null,
    req.body["language"] ? req.body["language"] : null,
    req.body["system_uid"] ? req.body["system_uid"] : null,
    req.body["program_uid"] ? req.body["program_uid"] : null,
  ];
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/sidebar/get_account_available_menu.sql")
    )
    .toString();
  await lib.requestAPI(
    "/get_account_available_menu",
    DBConfig,
    sql,
    parameter,
    res
  );
});

module.exports = router;
