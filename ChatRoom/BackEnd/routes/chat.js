const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const logger = require("../../../BackEnd_PostgreSQL/logger");
const { Pool } = require("pg");
const lib = require("../library");

router.route("/hello").get(async (req, res) => {
  res.send("hello!");
});

router.route("/get_userInfo").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  const pool = new Pool(DBConfig);
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/get_userInfo.sql"))
    .toString();
  pool.query(
    lib.queryConvert(sql, {
      token: req.body["access_token"] ? req.body["access_token"] : null,
    }),
    (err, result) => {
      if (result) {
        res.send(result);
      } else {
        logger.error(err);
      }
    }
  );
  pool.end();
});

router.route("/get_room_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  const pool = new Pool(DBConfig);
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/get_room_message.sql"))
    .toString();
  pool.query(
    lib.queryConvert(sql, {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
    }),
    (err, result) => {
      if (result) {
        res.send(result);
      } else {
        logger.error(err);
      }
    }
  );
  pool.end();
});

router.route("/insert_room_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  const pool = new Pool(DBConfig);
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/insert_room_message.sql")
    )
    .toString();
  pool.query(
    lib.queryConvert(sql, {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      room_id_1: req.body["room_id"] ? req.body["room_id"] : null,
      message_content: req.body["message_content"]
        ? req.body["message_content"]
        : null,
      send_member: req.body["send_member"] ? req.body["send_member"] : null,
    }),
    (err, result) => {
      if (result) {
        res.send(result);
      } else {
        logger.error(err);
      }
    }
  );
  pool.end();
});

module.exports = router;
