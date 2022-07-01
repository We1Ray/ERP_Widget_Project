const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/hello").get(async (req, res) => {
  res.send("hello!");
});

router.route("/ui_caption_properties").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};

  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/public/ui_caption_properties.sql")
    )
    .toString();
  await lib.requestAPI(
    "/ui_caption_properties",
    DBConfig,
    sql,
    {
      language: req.body["language"] ? req.body["language"] : null,
      source: req.body["source"] ? req.body["source"] : null,
      word: req.body["word"] ? req.body["word"] : null,
    },
    res
  );
});

router.route("/get_account_permissions").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
    factory_uid: req.body["factory_uid"] ? req.body["factory_uid"] : null,
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    program_code: req.body["program_code"] ? req.body["program_code"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/public/get_account_permissions.sql")
    )
    .toString();
  await lib.requestAPI(
    "/get_account_permissions",
    DBConfig,
    sql,
    parameter,
    res
  );
});

router.route("/get_ticket_granting_cookie").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/public/get_ticket_granting_cookie.sql")
    )
    .toString();
  await lib.requestAPI(
    "/get_ticket_granting_cookie",
    DBConfig,
    sql,
    parameter,
    res
  );
});

router.route("/get_account").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    account: req.body["account"] ? req.body["account"] : null,
    account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/public/get_account.sql"))
    .toString();
  await lib.requestAPI("/get_account", DBConfig, sql, parameter, res);
});

router.route("/create_account_access_token").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    expiration_date: req.body["expiration_date"]
      ? req.body["expiration_date"]
      : null,
    is_effective: req.body["is_effective"] ? req.body["is_effective"] : null,
    up_user: req.body["up_user"] ? req.body["up_user"] : null,
    create_user: req.body["create_user"] ? req.body["create_user"] : null,
    ldap_id: req.body["ldap_id"] ? req.body["ldap_id"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/public/create_account_access_token.sql")
    )
    .toString();
  await lib.executeAPI(
    "/create_account_access_token",
    DBConfig,
    sql,
    parameter,
    res
  );
});

router.route("/login").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    email: req.body["email"] ? req.body["email"] : null,
    password: req.body["password"] ? req.body["password"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/public/login.sql"))
    .toString();
  await lib.executeAPI("/login", DBConfig, sql, parameter, res);
});

module.exports = router;
