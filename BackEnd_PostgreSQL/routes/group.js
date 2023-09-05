const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_group_list_for_admin").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    group_GROUP_NAME: req.body["group_GROUP_NAME"]
      ? req.body["group_GROUP_NAME"]
      : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/group/get_group_list_for_admin.sql")
    )
    .toString();
  await lib.executeSQL(
    "/get_group_list_for_admin",
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

router.route("/qry_group_name").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    group_uid: req.body["group_uid"] ? req.body["group_uid"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/group/qry_group_name.sql"))
    .toString();
  await lib.executeSQL(
    "/qry_group_name",
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

router.route("/create_group").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    group_uid: req.body["group_uid"] ? req.body["group_uid"] : null,
    group_name: req.body["group_name"] ? req.body["group_name"] : null,
    is_core: req.body["is_core"] ? req.body["is_core"] : null,
    enabled: req.body["enabled"] ? req.body["enabled"] : null,
    parent_group_uid: req.body["parent_group_uid"]
      ? req.body["parent_group_uid"]
      : null,
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/group/create_group.sql"))
    .toString();
  await lib.executeSQL(
    "/create_group",
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

router.route("/update_group").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
    group_uid: req.body["group_uid"] ? req.body["group_uid"] : null,
    group_name: req.body["group_name"] ? req.body["group_name"] : null,
    is_core: req.body["is_core"] ? req.body["is_core"] : null,
    enabled: req.body["enabled"] ? req.body["enabled"] : null,
    parent_group_uid: req.body["parent_group_uid"]
      ? req.body["parent_group_uid"]
      : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/group/update_group.sql"))
    .toString();
  await lib.executeSQL(
    "/update_group",
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

router.route("/delete_group").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    group_uid: req.body["group_uid"] ? req.body["group_uid"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/group/delete_group.sql"))
    .toString();
  await lib.executeSQL(
    "/delete_group",
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
