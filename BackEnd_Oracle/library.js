const oracledb = require("oracledb");
const logger = require("./logger");

class library {
  async requestAPI(path, config, sql, parameter, res) {
    let conn = null;
    try {
      conn = await oracledb.getConnection(config);
      const result = await conn.execute(sql, parameter, {
        autoCommit: false,
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });
      await res.send(result.rows);
    } catch (err) {
      console.log(path, config, parameter, err);
      logger.error(err);
      await res.status(400).json({ error: err });
    } finally {
      if (conn) {
        // conn assignment worked, need to close
        await conn.close();
      }
    }
  }

  async executeAPI(path, config, sql, parameter, res) {
    let conn = null;
    try {
      conn = await oracledb.getConnection(config);
      if (Array.isArray(parameter)) {
        const result = await conn.executeMany(sql, parameter, {
          autoCommit: false,
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        });
        await conn.commit();
        await res.send(result);
      } else {
        const result = await conn.execute(sql, parameter, {
          autoCommit: false,
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        });
        await conn.commit();
        await res.send(result);
      }
    } catch (err) {
      console.log(path, config, parameter, err);
      logger.error(err);
      await conn.rollback();
      await res.status(400).json({ error: err });
    } finally {
      if (conn) {
        // conn assignment worked, need to close
        await conn.close();
      }
    }
  }

  async executeAPIs(path, config, executeList, res) {
    let conn = null;
    try {
      conn = await oracledb.getConnection(config);

      if (Array.isArray(executeList)) {
        for (let element of executeList) {
          if (Array.isArray(element.parameter)) {
            const result = await conn.executeMany(
              element.sql,
              element.parameter,
              { autoCommit: false, outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
          } else {
            console.log(element.parameter);
            console.log(element.parameter);
            const result = await conn.execute(element.sql, element.parameter, {
              autoCommit: false,
              outFormat: oracledb.OUT_FORMAT_OBJECT,
            });
          }
        }

        await conn.commit();
        await res.send({ error: false, "error-code": 0, message: "" });
      }
    } catch (err) {
      console.log(path, config, executeList, err);
      logger.error(err);
      await conn.rollback();
      await res.status(400).json({ error: err });
    } finally {
      if (conn) {
        // conn assignment worked, need to close
        await conn.close();
      }
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
