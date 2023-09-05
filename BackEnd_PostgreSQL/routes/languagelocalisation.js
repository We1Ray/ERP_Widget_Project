const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_languagelocalisation").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    languagelocalisation_KEY: req.body["languagelocalisation_KEY"]
      ? req.body["languagelocalisation_KEY"]
      : null,
    languagelocalisation_SOURCE: req.body["languagelocalisation_SOURCE"]
      ? req.body["languagelocalisation_SOURCE"]
      : null,
    languagelocalisation_LANGUAGE: req.body["languagelocalisation_LANGUAGE"]
      ? req.body["languagelocalisation_LANGUAGE"]
      : null,
    languagelocalisation_UP_DATE1: req.body["languagelocalisation_UP_DATE1"]
      ? req.body["languagelocalisation_UP_DATE1"]
      : null,
    languagelocalisation_UP_DATE2: req.body["languagelocalisation_UP_DATE2"]
      ? req.body["languagelocalisation_UP_DATE2"]
      : null,
    languagelocalisation_UP_USER: req.body["languagelocalisation_UP_USER"]
      ? req.body["languagelocalisation_UP_USER"]
      : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/languagelocalisation/get_languagelocalisation.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/get_languagelocalisation",
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
  await lib.executeSQL(
    "/get_language_list",
    DBConfig,
    sql,
    {},
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_source_list").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/languagelocalisation/get_source_list.sql")
    )
    .toString();
  await lib.executeSQL(
    "/get_source_list",
    DBConfig,
    sql,
    {},
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
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
          parameter.push({
            language: element["language"] ? element["language"] : null,
            source: element["source"] ? element["source"] : null,
            word: element["word"] ? element["word"] : null,
            access_token: element["access_token"]
              ? element["access_token"]
              : null,
            display: element["display"] ? element["display"] : null,
          });
        } catch (error) {
          console.log("error" + error);
        }
      })
    );
  } else {
    parameter = {
      language: req.body["language"] ? req.body["language"] : null,
      source: req.body["source"] ? req.body["source"] : null,
      word: req.body["word"] ? req.body["word"] : null,
      access_token: req.body["access_token"] ? req.body["access_token"] : null,
      display: req.body["display"] ? req.body["display"] : null,
    };
  }
  await lib.executeSQL(
    "/create_languagelocalisation",
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
          parameter.push({
            language: element["language"] ? element["language"] : null,
            source: element["source"] ? element["source"] : null,
            word: element["word"] ? element["word"] : null,
            access_token: element["access_token"]
              ? element["access_token"]
              : null,
            display: element["display"] ? element["display"] : null,
          });
        } catch (error) {
          console.log("error" + error);
        }
      })
    );
  } else {
    parameter = {
      language: req.body["language"] ? req.body["language"] : null,
      source: req.body["source"] ? req.body["source"] : null,
      word: req.body["word"] ? req.body["word"] : null,
      access_token: req.body["access_token"] ? req.body["access_token"] : null,
      display: req.body["display"] ? req.body["display"] : null,
    };
  }
  await lib.executeSQL(
    "/update_languagelocalisation",
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
          parameter.push({
            language: element["language"] ? element["language"] : null,
            source: element["source"] ? element["source"] : null,
            word: element["word"] ? element["word"] : null,
          });
        } catch (error) {
          console.log("error" + error);
        }
      })
    );
  } else {
    parameter = {
      language: req.body["language"] ? req.body["language"] : null,
      source: req.body["source"] ? req.body["source"] : null,
      word: req.body["word"] ? req.body["word"] : null,
    };
  }
  await lib.executeSQL(
    "/delete_languagelocalisation",
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
