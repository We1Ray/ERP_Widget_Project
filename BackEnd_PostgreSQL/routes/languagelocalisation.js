const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_languagelocalisation").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = [
    req.body["languagelocalisation_KEY"]
      ? req.body["languagelocalisation_KEY"]
      : null,
    req.body["languagelocalisation_SOURCE"]
      ? req.body["languagelocalisation_SOURCE"]
      : null,
    req.body["languagelocalisation_LANGUAGE"]
      ? req.body["languagelocalisation_LANGUAGE"]
      : null,
    req.body["languagelocalisation_UP_DATE1"]
      ? req.body["languagelocalisation_UP_DATE1"]
      : null,
    req.body["languagelocalisation_UP_DATE2"]
      ? req.body["languagelocalisation_UP_DATE2"]
      : null,
    req.body["languagelocalisation_UP_USER"]
      ? req.body["languagelocalisation_UP_USER"]
      : null,
  ];
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/languagelocalisation/get_languagelocalisation.sql"
      )
    )
    .toString();
  await lib.requestAPI(
    "/get_languagelocalisation",
    DBConfig,
    sql,
    parameter,
    res
  );
});

router.route("/get_language_list").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/languagelocalisation/get_language_list.sql"
      )
    )
    .toString();
  await lib.requestAPI("/get_language_list", DBConfig, sql, [], res);
});

router.route("/get_source_list").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/languagelocalisation/get_source_list.sql")
    )
    .toString();
  await lib.requestAPI("/get_source_list", DBConfig, sql, [], res);
});

router.route("/create_languagelocalisation").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/languagelocalisation/create_languagelocalisation.sql"
      )
    )
    .toString();
  let parameter = [];
  if (Array.isArray(req.body)) {
    await Promise.all(
      req.body.map(async (element) => {
        try {
          parameter.push([
            element["language"] ? element["language"] : null,
            element["source"] ? element["source"] : null,
            element["word"] ? element["word"] : null,
            element["access_token"] ? element["access_token"] : null,
            element["display"] ? element["display"] : null,
          ]);
        } catch (error) {
          console.log("error" + error);
        }
      })
    );
  } else {
    parameter.push(
      req.body["language"] ? req.body["language"] : null,
      req.body["source"] ? req.body["source"] : null,
      req.body["word"] ? req.body["word"] : null,
      req.body["access_token"] ? req.body["access_token"] : null,
      req.body["display"] ? req.body["display"] : null
    );
  }
  await lib.executeAPI(
    "/create_languagelocalisation",
    DBConfig,
    sql,
    parameter,
    res
  );
});

router.route("/update_languagelocalisation").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/languagelocalisation/create_languagelocalisation.sql"
      )
    )
    .toString();
  let parameter = [];
  if (Array.isArray(req.body)) {
    await Promise.all(
      req.body.map(async (element) => {
        try {
          parameter.push([
            element["language"] ? element["language"] : null,
            element["source"] ? element["source"] : null,
            element["word"] ? element["word"] : null,
            element["access_token"] ? element["access_token"] : null,
            element["display"] ? element["display"] : null,
          ]);
        } catch (error) {
          console.log("error" + error);
        }
      })
    );
  } else {
    parameter.push(
      req.body["language"] ? req.body["language"] : null,
      req.body["source"] ? req.body["source"] : null,
      req.body["word"] ? req.body["word"] : null,
      req.body["access_token"] ? req.body["access_token"] : null,
      req.body["display"] ? req.body["display"] : null
    );
  }
  await lib.executeAPI(
    "/update_languagelocalisation",
    DBConfig,
    sql,
    parameter,
    res
  );
});

router.route("/delete_languagelocalisation").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/languagelocalisation/delete_languagelocalisation.sql"
      )
    )
    .toString();
  let parameter = [];
  if (Array.isArray(req.body)) {
    await Promise.all(
      req.body.map(async (element) => {
        try {
          parameter.push([
            element["language"] ? element["language"] : null,
            element["source"] ? element["source"] : null,
            element["word"] ? element["word"] : null,
          ]);
        } catch (error) {
          console.log("error" + error);
        }
      })
    );
  } else {
    parameter.push(
      req.body["language"] ? req.body["language"] : null,
      req.body["source"] ? req.body["source"] : null,
      req.body["word"] ? req.body["word"] : null
    );
  }
  await lib.executeAPI(
    "/delete_languagelocalisation",
    DBConfig,
    sql,
    parameter,
    res
  );
});

module.exports = router;
