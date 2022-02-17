const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = 80;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);

const publicRouter = require('./routes/public');
const sidebarRouter = require('./routes/sidebar');

const systemRouter = require('./routes/system');
const system_programRouter = require('./routes/system_program');
const system_administratorRouter = require('./routes/system_administrator');
const system_program_functionRouter = require('./routes/system_program_function');
const system_factoryRouter = require('./routes/system_factory');

const groupRouter = require('./routes/group');
const group_permissionsRouter = require('./routes/group_permissions');
const group_accountRouter = require('./routes/group_account');

const languagelocalisationRouter = require('./routes/languagelocalisation');

app.use('/public', publicRouter);
app.use('/sidebar', sidebarRouter);

app.use('/system', systemRouter);
app.use('/system_program', system_programRouter);
app.use('/system_administrator', system_administratorRouter);
app.use('/system_program_function', system_program_functionRouter);
app.use('/system_factory', system_factoryRouter);

app.use('/group', groupRouter);
app.use('/group_permissions', group_permissionsRouter);
app.use('/group_account', group_accountRouter);

app.use('/languagelocalisation', languagelocalisationRouter);


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
