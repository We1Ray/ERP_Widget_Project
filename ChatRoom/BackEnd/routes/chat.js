const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/hello").get(async (req, res) => {
  res.send("hello!");
});

router.route("/get_userInfo").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/get_userInfo.sql"))
    .toString();

  await lib.requestAPI(
    "/get_userInfo",
    DBConfig,
    sql,
    {
      token: req.body["access_token"] ? req.body["access_token"] : null,
    },
    res
  );
});

router.route("/get_room_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/get_room_message.sql"))
    .toString();

  await lib.requestAPI(
    "/get_room_message",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      page: req.body["page"] ? req.body["page"] : null,
    },
    res
  );
});

router.route("/get_room_page_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_page_message.sql")
    )
    .toString();

  await lib.requestAPI(
    "/get_room_page_message",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      page: req.body["page"] ? req.body["page"] : null,
    },
    res
  );
});

router.route("/get_message_state").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/get_message_state.sql"))
    .toString();

  await lib.requestAPI(
    "/get_room_message",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      message_id: req.body["message_id"] ? req.body["message_id"] : null,
    },
    res
  );
});

router.route("/insert_room_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/insert_room_message.sql")
    )
    .toString();
  await lib.requestAPI(
    "/insert_room_message",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      message_content: req.body["message_content"]
        ? req.body["message_content"]
        : null,
      send_member: req.body["send_member"] ? req.body["send_member"] : null,
    },
    res
  );
});

router.route("/update_message_read").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/update_message_read.sql")
    )
    .toString();
  await lib.requestAPI(
    "/update_message_read",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
    },
    res
  );
});

module.exports = router;
