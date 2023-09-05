const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_system_platform_list").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    SEARCH_VALUE: req.body.SEARCH_VALUE ? req.body.SEARCH_VALUE : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_platform/get_system_platform_list.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/get_system_platform_list",
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

router.route("/create_system_platform").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    PLATFORM_CODE: req.body.PLATFORM_CODE ? req.body.PLATFORM_CODE : null,
    PLATFORM_NAME: req.body.PLATFORM_NAME ? req.body.PLATFORM_NAME : null,
    SEQ: req.body.SEQ ? req.body.SEQ : null,
    ENABLED: req.body.ENABLED ? req.body.ENABLED : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_platform/create_system_platform.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/create_system_platform",
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

router.route("/update_system_platform").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    PLATFORM_CODE: req.body.PLATFORM_CODE ? req.body.PLATFORM_CODE : null,
    PLATFORM_NAME: req.body.PLATFORM_NAME ? req.body.PLATFORM_NAME : null,
    SEQ: req.body.SEQ ? req.body.SEQ : null,
    ENABLED: req.body.ENABLED ? req.body.ENABLED : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_platform/update_system_platform.sql"
      )
    )
    .toString();
  await lib.executeSQL(
    "/update_system_platform",
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

router.route("/delete_system_platform").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../sql/system_platform/delete_system_platform.sql"
      )
    )
    .toString();

  if (Array.isArray(req.body)) {
    let parameter = [];
    await Promise.all(
      req.body.map(async (element) => {
        try {
          parameter.push({
            PLATFORM_CODE: element.PLATFORM_CODE ? element.PLATFORM_CODE : null,
          });
        } catch (error) {
          console.log("error" + error);
        }
      })
    );
    await lib.executeSQL(
      "/delete_system_platform",
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
  } else {
    let parameter = {
      PLATFORM_CODE: req.body.PLATFORM_CODE ? req.body.PLATFORM_CODE : null,
    };
    await lib.executeSQL(
      "/delete_system_platform",
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
  }
});

module.exports = router;
