const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_group_permissions").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = [
    req.body["group_permission_GROUP_UID"]
      ? req.body["group_permission_GROUP_UID"]
      : null,
    req.body["group_permission_FACTORY_UID"]
      ? req.body["group_permission_FACTORY_UID"]
      : null,
    req.body["group_permission_SYSTEM_UID"]
      ? req.body["group_permission_SYSTEM_UID"]
      : null,
    req.body["group_permission_PROGRAM_UID"]
      ? req.body["group_permission_PROGRAM_UID"]
      : null,
  ];
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/group_permissions/get_group_permissions.sql"
      )
    )
    .toString();
  await lib.requestAPI("/get_group_permissions", DBConfig, sql, parameter, res);
});

router.route("/update_group_permission").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = [
    req.body["group_uid"] ? req.body["group_uid"] : null,
    req.body["function_uid"] ? req.body["function_uid"] : null,
    req.body["factory_uid"] ? req.body["factory_uid"] : null,
    req.body["access_token"] ? req.body["access_token"] : null,
    req.body["editable"] ? req.body["editable"] : null,
    req.body["is_open"] ? req.body["is_open"] : null,
  ];
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/group_permissions/update_group_permission.sql"
      )
    )
    .toString();
  await lib.executeAPI(
    "/update_group_permission",
    DBConfig,
    sql,
    parameter,
    res
  );
});

module.exports = router;
