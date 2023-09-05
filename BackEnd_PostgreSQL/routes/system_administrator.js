const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_system_administrator").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    administrator_SYSTEM_UID: req.body["administrator_SYSTEM_UID"]
      ? req.body["administrator_SYSTEM_UID"]
      : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_administrator/get_system_administrator.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/get_system_administrator",
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

router.route("/get_accounts_not_in_system").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    account_not_in_system_KEY: req.body["account_not_in_system_KEY"]
      ? req.body["account_not_in_system_KEY"]
      : null,
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_administrator/get_accounts_not_in_system.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/get_accounts_not_in_system",
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

router.route("/get_account_info").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    key: req.body["key"] ? req.body["key"] : null,
    account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_administrator/get_account_info.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/get_account_info",
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

router.route("/create_system_administrator").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    expiration_date: req.body["expiration_date"]
      ? req.body["expiration_date"]
      : null,
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_administrator/create_system_administrator.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/create_system_administrator",
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

router.route("/update_system_administrator").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    expiration_date: req.body["expiration_date"]
      ? req.body["expiration_date"]
      : null,
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_administrator/update_system_administrator.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/update_system_administrator",
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

router.route("/delete_system_administrator").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_administrator/delete_system_administrator.sql"
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
            system_uid: element["system_uid"] ? element["system_uid"] : null,
          });
        } catch (error) {
          console.log("error" + error);
        }
      })
    );
  } else {
    parameter = {
      account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
      system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    };
  }
  await lib.executeSQL(
    "/delete_system_administrator",
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
