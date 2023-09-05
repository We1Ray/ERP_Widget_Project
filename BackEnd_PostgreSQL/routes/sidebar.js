const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_account_available_menu").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
    factory_uid: req.body["factory_uid"] ? req.body["factory_uid"] : null,
    language: req.body["language"] ? req.body["language"] : null,
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    program_uid: req.body["program_uid"] ? req.body["program_uid"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/sidebar/get_account_available_menu.sql")
    )
    .toString();
  await lib.executeSQL(
    "/get_account_available_menu",
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

module.exports = router;
