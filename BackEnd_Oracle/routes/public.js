const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");
const oracledb = require("oracledb");

router.route("/hello").get(async (req, res) => {
  res.send("hello!");
});

router.route("/ui_caption_properties").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    LANGUAGE: req.body.LANGUAGE ? req.body.LANGUAGE : null,
    SOURCE: req.body.SOURCE ? req.body.SOURCE : null,
    WORD: req.body.WORD ? req.body.WORD : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/public/ui_caption_properties.sql")
    )
    .toString();
  await lib.requestAPI("/ui_caption_properties", DBConfig, sql, parameter, res);
});

router.route("/localization").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/public/ui_caption_properties.sql")
    )
    .toString();
  let conn = null;
  try {
    conn = await oracledb.getConnection(DBConfig);
    let value = {};
    for (let index = 0; index < req.body.length; index++) {
      let parameter = {
        LANGUAGE: req.body[index].LANGUAGE ? req.body[index].LANGUAGE : null,
        SOURCE: req.body[index].SOURCE ? req.body[index].SOURCE : null,
        WORD: req.body[index].WORD ? req.body[index].WORD : null,
      };
      const result = await conn.execute(sql, parameter, {
        autoCommit: false,
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });
      if (result.rows[0]) {
        value[req.body[index]["NAME"]] = await result.rows[0]["DISPLAY"];
      } else {
        value[req.body[index]["NAME"]] = "";
      }
    }
    res.send(value);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  } finally {
    if (conn) {
      // conn assignment worked, need to close
      conn.close();
    }
  }
});

router.route("/get_account_permissions").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    ACCOUNT_UID: req.body.ACCOUNT_UID ? req.body.ACCOUNT_UID : null,
    ACCESS_TOKEN: req.body.ACCESS_TOKEN ? req.body.ACCESS_TOKEN : null,
    PROGRAM_CODE: req.body.PROGRAM_CODE ? req.body.PROGRAM_CODE : null,
    SYSTEM_UID: req.body.SYSTEM_UID ? req.body.SYSTEM_UID : null,
    FACTORY_UID: req.body.FACTORY_UID ? req.body.FACTORY_UID : null,
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
    ACCESS_TOKEN: req.body.ACCESS_TOKEN ? req.body.ACCESS_TOKEN : null,
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
    ACCOUNT: req.body.ACCOUNT ? req.body.ACCOUNT : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/public/get_account.sql"))
    .toString();
  await lib.requestAPI("/get_account", DBConfig, sql, parameter, res);
});

router.route("/create_account_access_token").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    LDAP_ID: req.body.LDAP_ID ? req.body.LDAP_ID : null,
    ACCESS_TOKEN: req.body.ACCESS_TOKEN ? req.body.ACCESS_TOKEN : null,
    SYSTEM_UID: req.body.SYSTEM_UID ? req.body.SYSTEM_UID : null,
    EXPIRATION_DATE: req.body.EXPIRATION_DATE ? req.body.EXPIRATION_DATE : null,
    IS_EFFECTIVE: req.body.IS_EFFECTIVE ? req.body.IS_EFFECTIVE : null,
    UP_USER: req.body.UP_USER ? req.body.UP_USER : null,
    CREATE_USER: req.body.CREATE_USER ? req.body.CREATE_USER : null,
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
    EMAIL: req.body.EMAIL ? req.body.EMAIL : null,
    PASSWORD: req.body.PASSWORD ? req.body.PASSWORD : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/public/login.sql"))
    .toString();
  await lib.executeAPI("/login", DBConfig, sql, parameter, res);
});

module.exports = router;
