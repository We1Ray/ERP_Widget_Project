const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const publicRouter = require("./routes/public");
const sidebarRouter = require("./routes/sidebar");

const systemRouter = require("./routes/system");
const system_programRouter = require("./routes/system_program");
const system_administratorRouter = require("./routes/system_administrator");
const system_program_functionRouter = require("./routes/system_program_function");
const system_factoryRouter = require("./routes/system_factory");

const groupRouter = require("./routes/group");
const group_permissionsRouter = require("./routes/group_permissions");
const group_accountRouter = require("./routes/group_account");

const languagelocalisationRouter = require("./routes/languagelocalisation");

const emailRouter = require("./routes/email");

app.use("/public", publicRouter);
app.use("/sidebar", sidebarRouter);

app.use("/system", systemRouter);
app.use("/system_program", system_programRouter);
app.use("/system_administrator", system_administratorRouter);
app.use("/system_program_function", system_program_functionRouter);
app.use("/system_factory", system_factoryRouter);

app.use("/group", groupRouter);
app.use("/group_permissions", group_permissionsRouter);
app.use("/group_account", group_accountRouter);

app.use("/languagelocalisation", languagelocalisationRouter);

app.use("/email", emailRouter);

// 檢查ES版本，若不支援 replaceAll，就加入自定
try {
  let k = 'replaceAll supported'
  console.log(k.replaceAll('a', 'a'))
} catch(err) {
  console.log("replaceAll not supported :(")
  String.prototype.replaceAll = function (target, payload) {
    let regex = new RegExp(target, 'gm')
    return this.valueOf().replace(regex, payload)
  };
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
