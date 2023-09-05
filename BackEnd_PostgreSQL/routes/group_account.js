const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_accounts_in_group").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    group_account_GROUP_UID: req.body["group_account_GROUP_UID"]
      ? req.body["group_account_GROUP_UID"]
      : null,
    group_account_SEARCH_VALUE: req.body["group_account_SEARCH_VALUE"]
      ? req.body["group_account_SEARCH_VALUE"]
      : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/group_account/get_accounts_in_group.sql")
    )
    .toString();
  await lib.executeSQL(
    "/get_accounts_in_group",
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

router.route("/get_accounts_not_in_group").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    group_uid: req.body["group_uid"] ? req.body["group_uid"] : null,
    account_not_group_KEY: req.body["account_not_group_KEY"]
      ? req.body["account_not_group_KEY"]
      : null,
    account_not_group_ACCOUNT_UID: req.body["account_not_group_ACCOUNT_UID"]
      ? req.body["account_not_group_ACCOUNT_UID"]
      : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/group_account/get_accounts_not_in_group.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/get_accounts_not_in_group",
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

router.route("/switch_account_into_group").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/group_account/switch_account_into_group.sql"
      )
    )
    .toString();
  let parameter = [];
  if (Array.isArray(req.body)) {
    await Promise.all(
      req.body.map(async (element) => {
        try {
          parameter.push({
            account_uid: element["account_uid"] ? element["account_uid"] : null,
            group_uid: element["group_uid"] ? element["group_uid"] : null,
            access_token: element["access_token"]
              ? element["access_token"]
              : null,
          });
        } catch (error) {
          console.log("error" + error);
        }
      })
    );
  } else {
    parameter = {
      account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
      group_uid: req.body["group_uid"] ? req.body["group_uid"] : null,
      access_token: req.body["access_token"] ? req.body["access_token"] : null,
    };
  }

  await lib.executeSQL(
    "/switch_account_into_group",
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
