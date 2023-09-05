const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_email").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    email: req.body["email"] ? req.body["email"] : null,
    displayname: req.body["displayname"] ? req.body["displayname"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/email/get_email.sql"))
    .toString();
  await lib.executeSQL(
    "/get_email",
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

router.route("/create_email").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    email: req.body["email"] ? req.body["email"] : null,
    displayname: req.body["displayname"] ? req.body["displayname"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/email/create_email.sql"))
    .toString();
  await lib.executeSQL(
    "/create_email",
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

router.route("/delete_email").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    email: req.body["email"] ? req.body["email"] : null,
    displayname: req.body["displayname"] ? req.body["displayname"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/email/delete_email.sql"))
    .toString();
  await lib.executeSQL(
    "/delete_email",
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

router.route("/get_group").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    groupid: req.body["groupid"] ? req.body["groupid"] : null,
    groupname: req.body["groupname"] ? req.body["groupname"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/email/get_group.sql"))
    .toString();
  await lib.executeSQL(
    "/get_group",
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

router.route("/delete_group").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    groupid: req.body["groupid"] ? req.body["groupid"] : null,
    groupname: req.body["groupname"] ? req.body["groupname"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/email/delete_group.sql"))
    .toString();
  await lib.executeSQL(
    "/delete",
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
    groupid: req.body["groupid"] ? req.body["groupid"] : null,
    groupname: req.body["groupname"] ? req.body["groupname"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/email/create_group.sql"))
    .toString();
  await lib.executeSQL(
    "/create_group",
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

router.route("/update_group").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    groupid: req.body["groupid"] ? req.body["groupid"] : null,
    groupname: req.body["groupname"] ? req.body["groupname"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/email/update_group.sql"))
    .toString();
  await lib.executeSQL(
    "/update_group",
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

router.route("/get_email_group").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    email: req.body["email"] ? req.body["email"] : null,
    displayname: req.body["displayname"] ? req.body["displayname"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/email/get_email_group.sql"))
    .toString();
  await lib.executeSQL(
    "/get_email_group",
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

router.route("/create_email_group").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    email: req.body["email"] ? req.body["email"] : null,
    displayname: req.body["displayname"] ? req.body["displayname"] : null,
    groupid: req.body["groupid"] ? req.body["groupid"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/email/create_email_group.sql"))
    .toString();
  await lib.executeSQL(
    "/create_email_group",
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

router.route("/delete_email_group").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    email: req.body["email"] ? req.body["email"] : null,
    groupid: req.body["groupid"] ? req.body["groupid"] : null,
    displayname: req.body["displayname"] ? req.body["displayname"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/email/delete_email_group.sql"))
    .toString();
  await lib.executeSQL(
    "/delete_email_group",
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

router.route("/get_email_group_list").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    email: req.body["email"] ? req.body["email"] : null,
    displayname: req.body["displayname"] ? req.body["displayname"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/email/get_email_group_list.sql"))
    .toString();
  await lib.executeSQL(
    "/get_email_group_list",
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

module.exports = router;
