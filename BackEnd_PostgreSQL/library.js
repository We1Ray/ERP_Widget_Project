const pg = require("pg");
const logger = require("./logger");

class library {
  async requestAPI(path, config, sql, parameter, res) {
    try {
      let pool = new pg.Pool(config);
      pool.connect((err, client, done) => {
        if (err) {
          console.error(path, config, parameter, err);
          logger.error(err);
          res.status(400).json({ error: err });
        } else {
          client.query(sql, parameter, (err, result) => {
            done(); // 釋放連線（將其返回給連線池）
            if (err) {
              console.error(path, config, parameter, err);
              logger.error(err);
              res.status(400).json({ error: err });
            } else {
              res.send(result.rows);
            }
          });
        }
      });
    } catch (err) {
      console.error(path, config, parameter, err);
      logger.error(err);
      await res.status(400).json({ error: err });
    }
  }

  async executeAPI(path, config, sql, parameter, res) {
    try {
      let pool = new pg.Pool(config);
      const client = await pool.connect();
      if (Array.isArray(parameter[0])) {
        try {
          await client.query("BEGIN");
          let result = null;
          for (let index = 0; index < parameter.length; index++) {
            result = await client.query(sql, parameter[index]);
          }
          await client.query("COMMIT");
          await res.send(result);
        } catch (err) {
          console.error(path, config, err);
          logger.error(err);
          await client.query("ROLLBACK");
          await res.status(400).json({ error: err });
        } finally {
          client.release();
        }
      } else {
        try {
          await client.query("BEGIN");
          const result = await client.query(sql, parameter);
          await client.query("COMMIT");
          await res.send(result);
        } catch (err) {
          console.error(path, config, err);
          logger.error(err);
          await client.query("ROLLBACK");
          await res.status(400).json({ error: err });
        } finally {
          client.release();
        }
      }
    } catch (err) {
      console.error(path, config, parameter, err);
      logger.error(err);
      await res.status(400).json({ error: err });
    }
  }

  async executeAPIs(path, config, executeList, res) {
    try {
      let pool = new pg.Pool(config);
      const client = await pool.connect();
      let result = null;
      await client.query("BEGIN");
      try {
        for (let index = 0; index < executeList.length; index++) {
          if (Array.isArray(executeList[index].parameter[0])) {
            for (let j = 0; j < executeList[index].parameter.length; j++) {
              result = await client.query(
                executeList[index].sql,
                executeList[index].parameter[j]
              );
            }
          } else {
            result = await client.query(
              executeList[index].sql,
              executeList[index].parameter
            );
          }
        }
        await client.query("COMMIT");
        await res.send(result);
      } catch (err) {
        console.error(path, config, err);
        logger.error(err);
        await client.query("ROLLBACK");
        await res.status(400).json({ error: err });
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(path, config, parameter, err);
      logger.error(err);
      await res.status(400).json({ error: err });
    }
  }

  uuid() {
    var d = Date.now();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }
}
const lib = new library();
module.exports = lib;
