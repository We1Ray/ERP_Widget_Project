const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");
const axios = require("axios");
var nodemailer = require("nodemailer");
const logger = require("../logger");

router.route("/hello").get(async (req, res) => {
  res.send("hello!");
});

router.route("/test").post(async (req, res) => {
  let dbConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};

  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/public/test.sql"))
    .toString();

  await lib.executeSQL(
    "/test",
    dbConfig,
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

router.route("/ui_caption_properties").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};

  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/public/ui_caption_properties.sql")
    )
    .toString();
  await lib.executeSQL(
    "/ui_caption_properties",
    DBConfig,
    sql,
    {
      language: req.body["language"] ? req.body["language"] : null,
      source: req.body["source"] ? req.body["source"] : null,
      word: req.body["word"] ? req.body["word"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_account_permissions").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
    factory_uid: req.body["factory_uid"] ? req.body["factory_uid"] : null,
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    program_code: req.body["program_code"] ? req.body["program_code"] : null,
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/public/get_account_permissions.sql")
    )
    .toString();
  await lib.executeSQL(
    "/get_account_permissions",
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

router.route("/get_ticket_granting_cookie").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
    isMobile: req.body["isMobile"] ? req.body["isMobile"] : "N",
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/public/get_ticket_granting_cookie.sql")
    )
    .toString();
  await lib.executeSQL(
    "/get_ticket_granting_cookie",
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

router.route("/get_account").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    account: req.body["account"] ? req.body["account"] : null,
    account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/public/get_account.sql"))
    .toString();
  await lib.executeSQL(
    "/get_account",
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

router.route("/create_account_access_token").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    access_token: req.body["access_token"] ? req.body["access_token"] : null,
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    expiration_date: req.body["expiration_date"]
      ? req.body["expiration_date"]
      : null,
    is_effective: req.body["is_effective"] ? req.body["is_effective"] : null,
    up_user: req.body["up_user"] ? req.body["up_user"] : null,
    create_user: req.body["create_user"] ? req.body["create_user"] : null,
    ldap_id: req.body["ldap_id"] ? req.body["ldap_id"] : null,
    isMobile: req.body["isMobile"] ? req.body["isMobile"] : 'N',
  };
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/public/create_account_access_token.sql")
    )
    .toString();
  await lib.executeSQL(
    "/create_account_access_token",
    DBConfig,
    sql,
    parameter,
    (response) => {
      // if (parameter !== "SYS_00001") {
      //   axios
      //     .post(
      //       "",//控制平台ip
      //       parameter,
      //       {
      //         headers: {
      //           factory: req.headers.factory,
      //         },
      //       }
      //     )
      //     .then((response) => {})
      //     .catch((error) => console.log(error));
      // }

      res.send(response);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/login").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    email: req.body["email"] ? req.body["email"] : null,
    password: req.body["password"] ? req.body["password"] : null,
  };
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/public/login.sql"))
    .toString();
  await lib.executeSQL(
    "/login",
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

router.route("/get_function_allow_accounts").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};

  let parameter = {
    access_token: req.body.access_token ? req.body.access_token : null,
    function_code: req.body.function_code ? req.body.function_code : null,
    program_code: req.body.program_code ? req.body.program_code : null,
    system_uid: req.body.system_uid ? req.body.system_uid : null,
    factory_uid: req.body.factory_uid ? req.body.factory_uid : null,
    key_word: req.body.key_word ? req.body.key_word : null,
    is_access_uid: req.body.access_uid ? "Y" : null,
    access_uid: req.body.access_uid ? req.body.access_uid : null,
    is_exclude_uid: req.body.exclude_uid ? "Y" : null,
    exclude_uid: req.body.exclude_uid ? req.body.exclude_uid : null,
  };

  /*
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/public/get_function_allow_accounts.sql")
    )
    .toString();
    */

  let sql = lib.placeholderFormat(
    fs
      .readFileSync(
        path.resolve(__dirname, "../sql/public/get_function_allow_accounts.sql")
      )
      .toString(),
    parameter.access_uid,
    parameter.exclude_uid
  );

  await lib.executeSQL(
    "/get_function_allow_accounts",
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

router.route("/create_system_account_access_token").post(async (req, res) => {
  logger.info("req", req);

  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let parameter = {
    system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
    system_factory_IS_ENABLED: req.body["system_factory_IS_ENABLED"]
      ? req.body["system_factory_IS_ENABLED"]
      : null,
  };

  logger.info("create_system_account_access_token", parameter);

  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/system_factory/get_system_factory.sql")
    )
    .toString();
  await lib.executeSQL(
    "/get_system_factory",
    DBConfig,
    sql,
    parameter,
    (response) => {
      let parms = [];

      logger.info("response.rows: ", response.rows);

      response.rows.map(async (element) => {
        try {
          parms.push({
            ws_url: element.ws_url ? element.ws_url : null,
          });
          let headers = {
            factory: element.ws_datasource,
          };

          let param = {
            access_token: req.body["access_token"]
              ? req.body["access_token"]
              : null,
            system_uid: req.body["system_uid"] ? req.body["system_uid"] : null,
            expiration_date: req.body["expiration_date"]
              ? req.body["expiration_date"]
              : null,
            is_effective: req.body["is_effective"]
              ? req.body["is_effective"]
              : null,
            up_user: req.body["up_user"] ? req.body["up_user"] : null,
            create_user: req.body["create_user"]
              ? req.body["create_user"]
              : null,
            ldap_id: req.body["ldap_id"] ? req.body["ldap_id"] : null,
          };

          axios
            .post(
              element.ws_url + "/public/create_account_access_token",
              param,
              {
                headers: headers,
              }
            )
            .then((response) => {})
            .catch((error) => console.log(error));
        } catch (error) {
          console.log("error" + error);
        }
      });

      res.send(response);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/send_mail").post(async (req, res) => {
  let transporter = nodemailer.createTransport({
    host: "",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: req.body.auth,
    tls: {
      rejectUnauthorized: false,
    },
  });

  let parameter = {
    from: req.body.from ? req.body.from : null,
    to: req.body.to ? req.body.to : null,
    subject: req.body.subject ? req.body.subject : null,
    text: req.body.text ? req.body.text : null,
    html: req.body.html ? req.body.html : null,
  };

  console.log(parameter);

  let info = await transporter.sendMail({
    from: parameter.from,
    to: parameter.to,
    subject: parameter.subject,
    text: parameter.text,
    html: parameter.html,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  res.send({ error: false });
});

module.exports = router;
